-- ═══════════════════════════════════════════════════════════════════════════
-- NOCTAVIAE — events, players, validated progress, leaderboards (Supabase/Postgres)
-- ═══════════════════════════════════════════════════════════════════════════
-- Design:
--   • All tables live in the private schema `noct`. Clients have NO direct table access
--     (RLS enabled, no policies, no grants). Every read/write goes through the
--     SECURITY DEFINER functions below, which check identity (auth.uid()), membership,
--     event state and game rules.
--   • Scores are computed on the server from validated claims. Puzzle answers and final
--     solutions are stored in canon tables that clients cannot read.
--   • Every claim/hint/completion carries a client transaction id; replays are no-ops.
-- Requires: Supabase Auth (auth.users, auth.uid()). Anonymous sign-ins enabled for players.

create schema if not exists noct;
revoke all on schema noct from public;

-- ───────────────────────────── Tables

create table if not exists noct.admins (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists noct.events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 500),
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'open', 'active', 'paused', 'completed', 'cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  access_code text not null unique check (access_code ~ '^[A-Z0-9]{6,12}$'),
  allowed_cases text[] not null default array['broadcast', 'harvest', 'house'],
  hint_costs int[] not null default array[20, 35, 50],
  start_balance int not null default 40 check (start_balance between 0 and 500),
  max_participants int not null default 200 check (max_participants between 1 and 1000),
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (array_length(hint_costs, 1) = 3 and 0 <= all (hint_costs) and 200 >= all (hint_costs)),
  check (allowed_cases <@ array['broadcast', 'harvest', 'house'] and array_length(allowed_cases, 1) >= 1),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table if not exists noct.members (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references noct.events (id) on delete cascade,
  user_id uuid not null,
  display_name text not null check (char_length(display_name) between 2 and 24),
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create unique index if not exists members_unique_name on noct.members (event_id, lower(display_name));

create table if not exists noct.claims (
  id bigint generated always as identity primary key,
  event_id uuid not null references noct.events (id) on delete cascade,
  member_id uuid not null references noct.members (id) on delete cascade,
  case_id text not null,
  reward_id text not null,
  score int not null,
  hint int not null,
  client_tx uuid not null,
  created_at timestamptz not null default now(),
  unique (member_id, case_id, reward_id),
  unique (member_id, client_tx)
);
create index if not exists claims_event on noct.claims (event_id, member_id);

create table if not exists noct.hint_tx (
  id bigint generated always as identity primary key,
  event_id uuid not null references noct.events (id) on delete cascade,
  member_id uuid not null references noct.members (id) on delete cascade,
  case_id text not null,
  target text not null,
  level int not null check (level between 1 and 3),
  cost int not null check (cost >= 0),
  client_tx uuid not null,
  created_at timestamptz not null default now(),
  unique (member_id, case_id, target, level),
  unique (member_id, client_tx)
);

create table if not exists noct.completions (
  member_id uuid not null references noct.members (id) on delete cascade,
  case_id text not null,
  outcome text not null check (outcome in ('strong', 'partial')),
  created_at timestamptz not null default now(),
  primary key (member_id, case_id)
);

create table if not exists noct.audit (
  id bigint generated always as identity primary key,
  event_id uuid references noct.events (id) on delete cascade,
  actor uuid,
  action text not null,
  target_member uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_event on noct.audit (event_id, created_at desc);

-- Canonical game data (generated from the game content by scripts/gen-canon-sql.mjs).
create table if not exists noct.canon_rewards (
  case_id text not null,
  reward_id text not null,
  score int not null,
  hint int not null,
  requires jsonb,
  primary key (case_id, reward_id)
);
create table if not exists noct.canon_puzzles (
  case_id text not null,
  puzzle_id text not null,
  type text not null,
  answer jsonb not null,
  filler text[] not null default '{}',
  requires jsonb,
  primary key (case_id, puzzle_id)
);
create table if not exists noct.canon_final (
  case_id text primary key,
  requires jsonb,
  questions jsonb not null,
  essential text[] not null,
  rumor_clues text[] not null default '{}',
  completion jsonb not null
);

-- Deny-all for clients: RLS on, no policies, no grants.
alter table noct.admins enable row level security;
alter table noct.events enable row level security;
alter table noct.members enable row level security;
alter table noct.claims enable row level security;
alter table noct.hint_tx enable row level security;
alter table noct.completions enable row level security;
alter table noct.audit enable row level security;
alter table noct.canon_rewards enable row level security;
alter table noct.canon_puzzles enable row level security;
alter table noct.canon_final enable row level security;

-- ───────────────────────────── Helpers (internal)

create or replace function noct.uid() returns uuid
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare u uuid;
begin
  u := auth.uid();
  if u is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return u;
end $$;

create or replace function noct.is_admin(u uuid) returns boolean
language sql stable security definer set search_path = noct, pg_temp as $$
  select exists (select 1 from noct.admins where user_id = u)
$$;

create or replace function noct.require_admin() returns uuid
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.uid();
begin
  if not noct.is_admin(u) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  return u;
end $$;

-- Same normalization as src/game/normalize.js (accents, Arabic letter variants, digits, punctuation).
create or replace function noct.normalize_answer(s text, filler text[] default '{}') returns text
language plpgsql immutable set search_path = noct, pg_temp as $$
declare
  t text := lower(coalesce(s, ''));
  w text;
  out text := '';
  f text[] := '{}';
begin
  t := translate(t, 'àáâãäåāèéêëēìíîïòóôõöōùúûüūçñýÿ', 'aaaaaaaeeeeeiiiiooooooouuuuucnyy');
  t := regexp_replace(t, '[ً-ٰٟـ]', '', 'g');
  t := translate(t, 'أإآٱةى٠١٢٣٤٥٦٧٨٩', 'ااااهي0123456789');
  t := regexp_replace(t, '[’''`"«»“”.,;:!?؟،()\-_/]', ' ', 'g');
  t := btrim(regexp_replace(t, '\s+', ' ', 'g'));
  foreach w in array coalesce(filler, '{}') loop
    f := f || noct.normalize_answer(w, '{}');
  end loop;
  foreach w in array string_to_array(t, ' ') loop
    if w <> '' and not (w = any (f)) then
      out := out || case when out = '' then '' else ' ' end || w;
    end if;
  end loop;
  return out;
end $$;

-- Evaluate a content condition (same DSL as src/game/conditions.js) against recorded claims.
create or replace function noct.cond_ok(c jsonb, claims text[]) returns boolean
language plpgsql immutable set search_path = noct, pg_temp as $$
declare x jsonb; k text; v text;
begin
  if c is null or c = 'null'::jsonb then return true; end if;
  if c ? 'all' then
    for x in select * from jsonb_array_elements(c -> 'all') loop
      if not noct.cond_ok(x, claims) then return false; end if;
    end loop;
    return true;
  end if;
  if c ? 'any' then
    for x in select * from jsonb_array_elements(c -> 'any') loop
      if noct.cond_ok(x, claims) then return true; end if;
    end loop;
    return false;
  end if;
  if c ? 'not' then return not noct.cond_ok(c -> 'not', claims); end if;
  select key, value #>> '{}' into k, v from jsonb_each(c) limit 1;
  return case k
    when 'clue' then ('clue:' || v) = any (claims)
    when 'item' then ('item:' || v) = any (claims)
    when 'holding' then ('item:' || v) = any (claims)
    when 'used' then ('item:' || v) = any (claims)
    when 'puzzle' then ('puzzle:' || v) = any (claims)
    when 'deduction' then ('deduction:' || v) = any (claims)
    when 'visited' then ('visit:' || v) = any (claims)
    when 'flag' then ('flag:' || v) = any (claims)
    when 'seen' then true -- not tracked server-side (documented limitation)
    else false
  end;
end $$;

-- Resolve the caller's membership for an event and check the event accepts game actions.
create or replace function noct.active_member(p_event uuid) returns noct.members
language plpgsql security definer set search_path = noct, pg_temp as $$
declare m noct.members; e noct.events; recent int;
begin
  select * into m from noct.members where event_id = p_event and user_id = noct.uid();
  if not found then raise exception 'not_member' using errcode = '42501'; end if;
  select * into e from noct.events where id = p_event;
  if e.status = 'paused' then raise exception 'event_paused' using errcode = 'P0001'; end if;
  if e.status <> 'active' then raise exception 'event_not_active' using errcode = 'P0001'; end if;
  if e.ends_at is not null and now() > e.ends_at then raise exception 'event_ended' using errcode = 'P0001'; end if;
  -- simple abuse protection: at most N game actions per member per 10 seconds
  -- (N = setting noct.rate_limit, default 40; clients retry rate-limited calls later)
  select count(*) into recent from noct.claims where member_id = m.id and created_at > now() - interval '10 seconds';
  if recent >= coalesce(nullif(current_setting('noct.rate_limit', true), '')::int, 40) then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return m;
end $$;

create or replace function noct.claims_of(p_member uuid, p_case text) returns text[]
language sql stable security definer set search_path = noct, pg_temp as $$
  select coalesce(array_agg(reward_id), '{}') from noct.claims where member_id = p_member and case_id = p_case
$$;

create or replace function noct.check_case(p_event uuid, p_case text) returns void
language plpgsql stable security definer set search_path = noct, pg_temp as $$
begin
  if not exists (select 1 from noct.events where id = p_event and p_case = any (allowed_cases)) then
    raise exception 'case_not_allowed' using errcode = 'P0001';
  end if;
end $$;

-- Insert a claim idempotently. Returns 'ok', 'already' or 'duplicate_tx'.
create or replace function noct.insert_claim(m noct.members, p_case text, p_reward text, p_tx uuid) returns text
language plpgsql security definer set search_path = noct, pg_temp as $$
declare r noct.canon_rewards;
begin
  if exists (select 1 from noct.claims where member_id = m.id and client_tx = p_tx) then return 'duplicate_tx'; end if;
  if exists (select 1 from noct.claims where member_id = m.id and case_id = p_case and reward_id = p_reward) then return 'already'; end if;
  select * into r from noct.canon_rewards where case_id = p_case and reward_id = p_reward;
  insert into noct.claims (event_id, member_id, case_id, reward_id, score, hint, client_tx)
  values (m.event_id, m.id, p_case, p_reward, coalesce(r.score, 0), coalesce(r.hint, 0), p_tx)
  on conflict do nothing;
  return 'ok';
end $$;

create or replace function noct.balance(m noct.members, p_case text) returns int
language sql stable security definer set search_path = noct, pg_temp as $$
  select e.start_balance
       + coalesce((select sum(hint) from noct.claims where member_id = m.id and case_id = p_case), 0)
       - coalesce((select sum(cost) from noct.hint_tx where member_id = m.id and case_id = p_case), 0)
  from noct.events e where e.id = m.event_id
$$;

create or replace function noct.member_score(p_member uuid) returns int
language sql stable security definer set search_path = noct, pg_temp as $$
  select coalesce(sum(score), 0)::int from noct.claims where member_id = p_member
$$;

-- ───────────────────────────── Player API

create or replace function public.noct_join(p_code text, p_name text) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare
  u uuid := noct.uid();
  e noct.events;
  m noct.members;
  n int;
  nm text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
begin
  if nm !~ '^[[:alnum:] _.\-؀-ۿ]{2,24}$' then
    return jsonb_build_object('ok', false, 'code', 'invalid_name');
  end if;
  select * into e from noct.events where access_code = upper(btrim(coalesce(p_code, '')));
  if not found then return jsonb_build_object('ok', false, 'code', 'unknown_code'); end if;
  select * into m from noct.members where event_id = e.id and user_id = u;
  if found then
    -- reconnecting: same membership, never a duplicate
    return jsonb_build_object('ok', true, 'code', 'rejoined', 'event_id', e.id, 'member_id', m.id, 'display_name', m.display_name);
  end if;
  if e.status not in ('open', 'active') then
    return jsonb_build_object('ok', false, 'code', 'event_' || e.status);
  end if;
  select count(*) into n from noct.members where event_id = e.id;
  if n >= e.max_participants then return jsonb_build_object('ok', false, 'code', 'event_full'); end if;
  if exists (select 1 from noct.members where event_id = e.id and lower(display_name) = lower(nm)) then
    return jsonb_build_object('ok', false, 'code', 'name_taken');
  end if;
  insert into noct.members (event_id, user_id, display_name) values (e.id, u, nm) returning * into m;
  insert into noct.audit (event_id, actor, action, target_member) values (e.id, u, 'member_joined', m.id);
  return jsonb_build_object('ok', true, 'code', 'joined', 'event_id', e.id, 'member_id', m.id, 'display_name', m.display_name);
end $$;

create or replace function public.noct_event_state(p_event uuid) returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.uid(); e noct.events; m noct.members;
begin
  select * into m from noct.members where event_id = p_event and user_id = u;
  if not found and not noct.is_admin(u) then raise exception 'not_member' using errcode = '42501'; end if;
  select * into e from noct.events where id = p_event;
  return jsonb_build_object(
    'event', jsonb_build_object('id', e.id, 'name', e.name, 'description', e.description, 'status', e.status,
      'starts_at', e.starts_at, 'ends_at', e.ends_at, 'allowed_cases', e.allowed_cases,
      'hint_costs', e.hint_costs, 'start_balance', e.start_balance),
    'member', case when m.id is null then null else jsonb_build_object('id', m.id, 'display_name', m.display_name) end,
    'score', case when m.id is null then 0 else noct.member_score(m.id) end,
    'claims', coalesce((select jsonb_object_agg(case_id, ids) from (
        select case_id, jsonb_agg(reward_id order by id) ids from noct.claims where member_id = m.id group by case_id) s), '{}'::jsonb),
    'hints', coalesce((select jsonb_agg(jsonb_build_object('case', case_id, 'target', target, 'level', level, 'cost', cost))
        from noct.hint_tx where member_id = m.id), '[]'::jsonb),
    'completions', coalesce((select jsonb_object_agg(case_id, outcome) from noct.completions where member_id = m.id), '{}'::jsonb)
  );
end $$;

create or replace function public.noct_my_events() returns jsonb
language sql stable security definer set search_path = noct, pg_temp as $$
  select coalesce(jsonb_agg(jsonb_build_object('event_id', e.id, 'name', e.name, 'status', e.status,
           'member_id', m.id, 'display_name', m.display_name) order by m.joined_at desc), '[]'::jsonb)
  from noct.members m join noct.events e on e.id = m.event_id
  where m.user_id = noct.uid()
$$;

-- Exploration, item, deduction and flag rewards. Puzzles, hints and completion have their own calls.
create or replace function public.noct_claim(p_event uuid, p_case text, p_reward text, p_tx uuid) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare m noct.members; r noct.canon_rewards; res text;
begin
  m := noct.active_member(p_event);
  perform noct.check_case(p_event, p_case);
  if p_reward !~ '^(visit|clue|item|deduction|flag):[a-z0-9_]{1,40}$' then
    return jsonb_build_object('ok', false, 'code', 'invalid_reward');
  end if;
  select * into r from noct.canon_rewards where case_id = p_case and reward_id = p_reward;
  if not found then return jsonb_build_object('ok', false, 'code', 'unknown_reward'); end if;
  if not noct.cond_ok(r.requires, noct.claims_of(m.id, p_case)) then
    return jsonb_build_object('ok', false, 'code', 'prerequisites_missing');
  end if;
  res := noct.insert_claim(m, p_case, p_reward, p_tx);
  return jsonb_build_object('ok', true, 'code', res, 'score', noct.member_score(m.id));
end $$;

create or replace function public.noct_solve(p_event uuid, p_case text, p_puzzle text, p_answer jsonb, p_tx uuid) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare m noct.members; z noct.canon_puzzles; ok boolean := false; a text; res text;
begin
  m := noct.active_member(p_event);
  perform noct.check_case(p_event, p_case);
  select * into z from noct.canon_puzzles where case_id = p_case and puzzle_id = p_puzzle;
  if not found then return jsonb_build_object('ok', false, 'code', 'unknown_puzzle'); end if;
  if ('puzzle:' || p_puzzle) = any (noct.claims_of(m.id, p_case)) then
    return jsonb_build_object('ok', true, 'code', 'already', 'score', noct.member_score(m.id));
  end if;
  if not noct.cond_ok(z.requires, noct.claims_of(m.id, p_case)) then
    return jsonb_build_object('ok', false, 'code', 'prerequisites_missing');
  end if;
  if z.type in ('choice', 'code') then
    ok := noct.normalize_answer(p_answer #>> '{}') = noct.normalize_answer(z.answer #>> '{}');
  elsif z.type = 'word' then
    a := noct.normalize_answer(p_answer #>> '{}', z.filler);
    ok := a <> '' and exists (select 1 from jsonb_array_elements_text(z.answer) w where noct.normalize_answer(w, z.filler) = a);
  elsif z.type in ('order', 'multi', 'classify', 'match') then
    ok := case when z.type = 'multi'
                then (select coalesce(array_agg(x order by x), '{}') from jsonb_array_elements_text(p_answer) x)
                   = (select coalesce(array_agg(x order by x), '{}') from jsonb_array_elements_text(z.answer) x)
                else p_answer = z.answer end;
  end if;
  if not ok then return jsonb_build_object('ok', false, 'code', 'wrong'); end if;
  res := noct.insert_claim(m, p_case, 'puzzle:' || p_puzzle, p_tx);
  return jsonb_build_object('ok', true, 'code', res, 'score', noct.member_score(m.id));
end $$;

create or replace function public.noct_buy_hint(p_event uuid, p_case text, p_target text, p_level int, p_tx uuid) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare m noct.members; e noct.events; cost int; bal int; req jsonb; cl text[];
begin
  m := noct.active_member(p_event);
  perform noct.check_case(p_event, p_case);
  select * into e from noct.events where id = p_event;
  if p_level not between 1 and 3 then return jsonb_build_object('ok', false, 'code', 'unknown_hint'); end if;
  if exists (select 1 from noct.hint_tx where member_id = m.id and client_tx = p_tx) then
    return jsonb_build_object('ok', true, 'code', 'duplicate_tx', 'balance', noct.balance(m, p_case));
  end if;
  if exists (select 1 from noct.hint_tx where member_id = m.id and case_id = p_case and target = p_target and level = p_level) then
    return jsonb_build_object('ok', true, 'code', 'already_purchased', 'balance', noct.balance(m, p_case));
  end if;
  if p_target = 'final' then
    select requires into req from noct.canon_final where case_id = p_case;
  else
    select requires into req from noct.canon_puzzles where case_id = p_case and puzzle_id = p_target;
    if not found then return jsonb_build_object('ok', false, 'code', 'unknown_hint'); end if;
  end if;
  cl := noct.claims_of(m.id, p_case);
  if not noct.cond_ok(req, cl) and not (('puzzle:' || p_target) = any (cl)) then
    return jsonb_build_object('ok', false, 'code', 'hint_unavailable');
  end if;
  if p_level > 1 and not exists (select 1 from noct.hint_tx where member_id = m.id and case_id = p_case and target = p_target and level = p_level - 1) then
    return jsonb_build_object('ok', false, 'code', 'previous_level_first');
  end if;
  cost := e.hint_costs[p_level];
  -- lock the member row so concurrent purchases cannot overspend
  perform 1 from noct.members where id = m.id for update;
  bal := noct.balance(m, p_case);
  if bal < cost then return jsonb_build_object('ok', false, 'code', 'insufficient', 'balance', bal, 'cost', cost); end if;
  insert into noct.hint_tx (event_id, member_id, case_id, target, level, cost, client_tx)
  values (p_event, m.id, p_case, p_target, p_level, cost, p_tx);
  return jsonb_build_object('ok', true, 'code', 'purchased', 'cost', cost, 'balance', bal - cost);
end $$;

create or replace function public.noct_complete(p_event uuid, p_case text, p_answers jsonb, p_tx uuid) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare
  m noct.members; f noct.canon_final; cl text[]; q jsonb; a jsonb;
  core_ok boolean := true; all_ok boolean := true; ok boolean; outcome text; res text;
begin
  m := noct.active_member(p_event);
  perform noct.check_case(p_event, p_case);
  if exists (select 1 from noct.completions where member_id = m.id and case_id = p_case) then
    return jsonb_build_object('ok', true, 'code', 'already', 'score', noct.member_score(m.id));
  end if;
  select * into f from noct.canon_final where case_id = p_case;
  cl := noct.claims_of(m.id, p_case);
  if not noct.cond_ok(f.requires, cl) then return jsonb_build_object('ok', false, 'code', 'prerequisites_missing'); end if;
  for q in select * from jsonb_array_elements(f.questions) loop
    a := p_answers -> (q ->> 'id');
    if q ->> 'type' = 'evidence' then
      -- every required clue must be chosen AND actually discovered; no rumours as evidence
      ok := not exists (select 1 from jsonb_array_elements_text(q -> 'required') c
                        where not (a ? c) or not (('clue:' || c) = any (cl)))
        and not exists (select 1 from jsonb_array_elements_text(coalesce(a, '[]')) c where c = any (f.rumor_clues));
    else
      ok := a = q -> 'answer';
    end if;
    if not ok then
      all_ok := false;
      if (q ->> 'core')::boolean then core_ok := false; end if;
    end if;
  end loop;
  if not core_ok then return jsonb_build_object('ok', false, 'code', 'incomplete'); end if;
  outcome := case when all_ok and not exists (select 1 from unnest(f.essential) d where not (('deduction:' || d) = any (cl)))
                  then 'strong' else 'partial' end;
  insert into noct.completions (member_id, case_id, outcome) values (m.id, p_case, outcome) on conflict do nothing;
  insert into noct.claims (event_id, member_id, case_id, reward_id, score, hint, client_tx)
  values (m.event_id, m.id, p_case, 'complete:' || outcome, (f.completion ->> outcome)::int, 0, p_tx)
  on conflict do nothing;
  insert into noct.audit (event_id, actor, action, target_member, details)
  values (m.event_id, m.user_id, 'case_completed', m.id, jsonb_build_object('case', p_case, 'outcome', outcome));
  return jsonb_build_object('ok', true, 'code', 'completed', 'outcome', outcome, 'score', noct.member_score(m.id));
end $$;

-- Ranking: score desc, completed cases desc, earliest time the score was reached, earliest join, id.
create or replace function public.noct_leaderboard(p_event uuid) returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.uid();
begin
  if not exists (select 1 from noct.members where event_id = p_event and user_id = u) and not noct.is_admin(u) then
    raise exception 'not_member' using errcode = '42501';
  end if;
  return coalesce((
    select jsonb_agg(row_to_json(t) order by t.rank)
    from (
      select rank() over w as rank, s.display_name, s.score, s.cases_completed, s.is_me
      from (
        select m.id, m.display_name, m.joined_at, m.user_id = u as is_me,
               coalesce(sum(c.score), 0)::int as score,
               (select count(*) from noct.completions x where x.member_id = m.id)::int as cases_completed,
               coalesce(max(c.created_at) filter (where c.score > 0), m.joined_at) as reached_at
        from noct.members m left join noct.claims c on c.member_id = m.id
        where m.event_id = p_event
        group by m.id
      ) s
      window w as (order by s.score desc, s.cases_completed desc, s.reached_at asc, s.joined_at asc, s.id asc)
    ) t
  ), '[]'::jsonb);
end $$;

-- ───────────────────────────── Admin API

create or replace function noct.valid_transition(f text, t text) returns boolean
language sql immutable as $$
  select (f, t) in (
    ('draft', 'scheduled'), ('draft', 'open'), ('draft', 'cancelled'),
    ('scheduled', 'open'), ('scheduled', 'cancelled'),
    ('open', 'active'), ('open', 'paused'), ('open', 'cancelled'),
    ('active', 'paused'), ('active', 'completed'), ('active', 'cancelled'),
    ('paused', 'active'), ('paused', 'completed'), ('paused', 'cancelled'))
$$;

create or replace function noct.event_json(e noct.events) returns jsonb
language sql stable security definer set search_path = noct, pg_temp as $$
  select jsonb_build_object('id', e.id, 'name', e.name, 'description', e.description, 'status', e.status,
    'starts_at', e.starts_at, 'ends_at', e.ends_at, 'access_code', e.access_code, 'allowed_cases', e.allowed_cases,
    'hint_costs', e.hint_costs, 'start_balance', e.start_balance, 'max_participants', e.max_participants,
    'created_at', e.created_at, 'updated_at', e.updated_at,
    'participants', (select count(*) from noct.members where event_id = e.id))
$$;

create or replace function public.noct_admin_whoami() returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.uid();
begin
  return jsonb_build_object('user_id', u, 'is_admin', noct.is_admin(u));
end $$;

create or replace function public.noct_admin_events() returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
begin
  perform noct.require_admin();
  return coalesce((select jsonb_agg(noct.event_json(e) order by e.created_at desc) from noct.events e), '[]'::jsonb);
end $$;

create or replace function public.noct_admin_save_event(p_event uuid, p jsonb) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.require_admin(); e noct.events; code text;
begin
  if p_event is null then
    code := upper(coalesce(nullif(p ->> 'access_code', ''), substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));
    insert into noct.events (name, description, starts_at, ends_at, access_code, allowed_cases, hint_costs, start_balance, max_participants, created_by)
    values (p ->> 'name', coalesce(p ->> 'description', ''), (p ->> 'starts_at')::timestamptz, (p ->> 'ends_at')::timestamptz, code,
            coalesce((select array_agg(x) from jsonb_array_elements_text(p -> 'allowed_cases') x), array['broadcast', 'harvest', 'house']),
            coalesce((select array_agg(x::int) from jsonb_array_elements_text(p -> 'hint_costs') x), array[20, 35, 50]),
            coalesce((p ->> 'start_balance')::int, 40), coalesce((p ->> 'max_participants')::int, 200), u)
    returning * into e;
    insert into noct.audit (event_id, actor, action, details) values (e.id, u, 'event_created', jsonb_build_object('name', e.name));
  else
    select * into e from noct.events where id = p_event for update;
    if not found then return jsonb_build_object('ok', false, 'code', 'unknown_event'); end if;
    if e.status in ('completed', 'cancelled') then return jsonb_build_object('ok', false, 'code', 'event_closed'); end if;
    update noct.events set
      name = coalesce(p ->> 'name', name),
      description = coalesce(p ->> 'description', description),
      starts_at = case when p ? 'starts_at' then (p ->> 'starts_at')::timestamptz else starts_at end,
      ends_at = case when p ? 'ends_at' then (p ->> 'ends_at')::timestamptz else ends_at end,
      allowed_cases = coalesce((select array_agg(x) from jsonb_array_elements_text(p -> 'allowed_cases') x), allowed_cases),
      hint_costs = coalesce((select array_agg(x::int) from jsonb_array_elements_text(p -> 'hint_costs') x), hint_costs),
      start_balance = coalesce((p ->> 'start_balance')::int, start_balance),
      max_participants = coalesce((p ->> 'max_participants')::int, max_participants),
      updated_at = now()
    where id = p_event returning * into e;
    insert into noct.audit (event_id, actor, action, details) values (e.id, u, 'event_updated', p - 'access_code');
  end if;
  return jsonb_build_object('ok', true, 'event', noct.event_json(e));
exception
  when check_violation or not_null_violation or invalid_text_representation or invalid_datetime_format then
    return jsonb_build_object('ok', false, 'code', 'invalid_event');
  when unique_violation then
    return jsonb_build_object('ok', false, 'code', 'code_taken');
end $$;

create or replace function public.noct_admin_set_status(p_event uuid, p_status text) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.require_admin(); e noct.events;
begin
  select * into e from noct.events where id = p_event for update;
  if not found then return jsonb_build_object('ok', false, 'code', 'unknown_event'); end if;
  if not noct.valid_transition(e.status, p_status) then
    return jsonb_build_object('ok', false, 'code', 'invalid_transition', 'from', e.status, 'to', p_status);
  end if;
  update noct.events set status = p_status, updated_at = now() where id = p_event returning * into e;
  insert into noct.audit (event_id, actor, action, details)
  values (p_event, u, 'status_changed', jsonb_build_object('to', p_status));
  return jsonb_build_object('ok', true, 'event', noct.event_json(e));
end $$;

create or replace function public.noct_admin_event_detail(p_event uuid) returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
declare e noct.events;
begin
  perform noct.require_admin();
  select * into e from noct.events where id = p_event;
  if not found then return jsonb_build_object('ok', false, 'code', 'unknown_event'); end if;
  return jsonb_build_object(
    'ok', true,
    'event', noct.event_json(e),
    'members', coalesce((select jsonb_agg(jsonb_build_object(
        'id', m.id, 'display_name', m.display_name, 'joined_at', m.joined_at,
        'score', noct.member_score(m.id),
        'puzzles', (select count(*) from noct.claims c where c.member_id = m.id and c.reward_id like 'puzzle:%'),
        'hints', (select count(*) from noct.hint_tx h where h.member_id = m.id),
        'completed', (select coalesce(jsonb_object_agg(case_id, outcome), '{}'::jsonb) from noct.completions x where x.member_id = m.id),
        'last_activity', (select max(created_at) from noct.claims c where c.member_id = m.id)) order by m.joined_at)
      from noct.members m where m.event_id = p_event), '[]'::jsonb),
    'stats', jsonb_build_object(
      'participants', (select count(*) from noct.members where event_id = p_event),
      'completions', (select coalesce(jsonb_object_agg(case_id, n), '{}'::jsonb) from (
          select x.case_id, count(*) n from noct.completions x join noct.members m on m.id = x.member_id
          where m.event_id = p_event group by x.case_id) s),
      'puzzles', (select coalesce(jsonb_object_agg(reward_id, n), '{}'::jsonb) from (
          select case_id || '/' || substr(reward_id, 8) reward_id, count(*) n from noct.claims
          where event_id = p_event and reward_id like 'puzzle:%' group by 1) s)));
end $$;

create or replace function public.noct_admin_audit(p_event uuid) returns jsonb
language plpgsql stable security definer set search_path = noct, pg_temp as $$
begin
  perform noct.require_admin();
  return coalesce((select jsonb_agg(jsonb_build_object('at', a.created_at, 'action', a.action, 'details', a.details,
      'member', (select display_name from noct.members m where m.id = a.target_member),
      'by_admin', noct.is_admin(a.actor)) order by a.created_at desc)
    from (select * from noct.audit where event_id = p_event order by created_at desc limit 300) a), '[]'::jsonb);
end $$;

-- CSV export rows: only display data (no user ids, emails or tokens).
create or replace function public.noct_admin_export(p_event uuid) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.require_admin();
begin
  insert into noct.audit (event_id, actor, action) values (p_event, u, 'results_exported');
  return public.noct_leaderboard(p_event);
end $$;

create or replace function public.noct_admin_reset_member(p_event uuid, p_member uuid, p_case text default null) returns jsonb
language plpgsql security definer set search_path = noct, pg_temp as $$
declare u uuid := noct.require_admin();
begin
  if not exists (select 1 from noct.members where id = p_member and event_id = p_event) then
    return jsonb_build_object('ok', false, 'code', 'unknown_member');
  end if;
  delete from noct.claims where member_id = p_member and (p_case is null or case_id = p_case);
  delete from noct.hint_tx where member_id = p_member and (p_case is null or case_id = p_case);
  delete from noct.completions where member_id = p_member and (p_case is null or case_id = p_case);
  insert into noct.audit (event_id, actor, action, target_member, details)
  values (p_event, u, 'member_reset', p_member, jsonb_build_object('case', coalesce(p_case, 'all')));
  return jsonb_build_object('ok', true);
end $$;

-- ───────────────────────────── Grants: only the RPCs are callable, only by signed-in users.
revoke all on all functions in schema noct from public;
revoke execute on function public.noct_join, public.noct_event_state, public.noct_my_events, public.noct_claim,
  public.noct_solve, public.noct_buy_hint, public.noct_complete, public.noct_leaderboard, public.noct_admin_whoami,
  public.noct_admin_events, public.noct_admin_save_event, public.noct_admin_set_status, public.noct_admin_event_detail,
  public.noct_admin_audit, public.noct_admin_export, public.noct_admin_reset_member from public;
grant execute on function public.noct_join, public.noct_event_state, public.noct_my_events, public.noct_claim,
  public.noct_solve, public.noct_buy_hint, public.noct_complete, public.noct_leaderboard, public.noct_admin_whoami,
  public.noct_admin_events, public.noct_admin_save_event, public.noct_admin_set_status, public.noct_admin_event_detail,
  public.noct_admin_audit, public.noct_admin_export, public.noct_admin_reset_member to authenticated;
