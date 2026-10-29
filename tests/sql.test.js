// Runs the real Supabase migration in PGlite (Postgres compiled to WASM) with a minimal
// Supabase-like auth stub, and tests the server-side rules as different users.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { caseById } from '../src/content/index.js';
import { act, newProgress, scoreOf } from '../src/game/engine.js';

const ADMIN = '00000000-0000-4000-8000-0000000000a1';
const P1 = '00000000-0000-4000-8000-0000000000b1';
const P2 = '00000000-0000-4000-8000-0000000000b2';
const P3 = '00000000-0000-4000-8000-0000000000b3';

let db;

async function as(user, sql, params = []) {
  await db.exec(`reset role; set role authenticated; select set_config('request.jwt.claim.sub', '${user ?? ''}', false);`);
  try {
    const res = await db.query(sql, params);
    return res.rows[0] ? Object.values(res.rows[0])[0] : null;
  } finally {
    await db.exec('reset role');
  }
}
const rpc = (user, fn, ...args) => as(user, `select public.${fn}(${args.map((_, i) => `$${i + 1}`).join(', ')}) as r`, args);
const errOf = async (p) => {
  try {
    await p;
    return null;
  } catch (e) {
    return e.message;
  }
};

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role authenticated nologin;
    create role anon nologin;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated, anon;
    grant execute on function auth.uid() to authenticated, anon;
  `);
  await db.exec(readFileSync(new URL('../supabase/migrations/001_noctaviae.sql', import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/002_canon.sql', import.meta.url), 'utf8'));
  await db.query('insert into noct.admins (user_id) values ($1)', [ADMIN]);
}, 60000);

describe('authorization', () => {
  it('rejects unauthenticated calls', async () => {
    expect(await errOf(rpc(null, 'noct_admin_events'))).toMatch(/not_authenticated/);
    expect(await errOf(rpc(null, 'noct_join', 'ABCDEF', 'Zed'))).toMatch(/not_authenticated/);
  });
  it('rejects admin calls from players', async () => {
    expect(await errOf(rpc(P1, 'noct_admin_events'))).toMatch(/not_authorized/);
    expect(await errOf(rpc(P1, 'noct_admin_save_event', null, JSON.stringify({ name: 'x' })))).toMatch(/not_authorized/);
  });
  it('gives clients no direct table access', async () => {
    expect(await errOf(as(P1, 'select * from noct.claims'))).toMatch(/permission denied/);
    expect(await errOf(as(P1, 'select * from noct.canon_puzzles'))).toMatch(/permission denied/);
    expect(await errOf(as(P1, "insert into noct.claims (event_id) values (gen_random_uuid())"))).toMatch(/permission denied/);
  });
  it('confirms admin identity only to admins', async () => {
    expect((await rpc(ADMIN, 'noct_admin_whoami')).is_admin).toBe(true);
    expect((await rpc(P1, 'noct_admin_whoami')).is_admin).toBe(false);
  });
});

describe('event lifecycle and play', () => {
  let ev;
  it('lets an admin create an event with validated settings', async () => {
    const bad = await rpc(ADMIN, 'noct_admin_save_event', null, JSON.stringify({ name: 'Bad', hint_costs: [1, 2, 999] }));
    expect(bad).toMatchObject({ ok: false, code: 'invalid_event' });
    const r = await rpc(ADMIN, 'noct_admin_save_event', null, JSON.stringify({ name: 'Halloween night', access_code: 'HOLLOW31', allowed_cases: ['broadcast', 'house'] }));
    expect(r.ok).toBe(true);
    ev = r.event;
    expect(ev.status).toBe('draft');
    const dup = await rpc(ADMIN, 'noct_admin_save_event', null, JSON.stringify({ name: 'Other', access_code: 'HOLLOW31' }));
    expect(dup.code).toBe('code_taken');
  });

  it('enforces valid status transitions', async () => {
    expect((await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'completed')).code).toBe('invalid_transition');
    expect((await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'open')).ok).toBe(true);
  });

  it('handles joining: bad code, bad name, rejoin without duplicates, taken names', async () => {
    expect((await rpc(P1, 'noct_join', 'NOPE99', 'Amal')).code).toBe('unknown_code');
    expect((await rpc(P1, 'noct_join', 'hollow31', '<script>')).code).toBe('invalid_name');
    const j1 = await rpc(P1, 'noct_join', 'hollow31', 'Amal');
    expect(j1.code).toBe('joined');
    const again = await rpc(P1, 'noct_join', 'HOLLOW31', 'Amal');
    expect(again).toMatchObject({ code: 'rejoined', member_id: j1.member_id });
    expect((await rpc(P2, 'noct_join', 'HOLLOW31', 'amal')).code).toBe('name_taken');
    expect((await rpc(P2, 'noct_join', 'HOLLOW31', 'Badr')).code).toBe('joined');
  });

  it('refuses game actions until the event is active', async () => {
    expect(await errOf(rpc(P1, 'noct_claim', ev.id, 'broadcast', 'visit:station', randomUUID()))).toMatch(/event_not_active/);
    expect((await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'active')).ok).toBe(true);
  });

  it('refuses non-members and disallowed cases', async () => {
    expect(await errOf(rpc(P3, 'noct_claim', ev.id, 'broadcast', 'visit:station', randomUUID()))).toMatch(/not_member/);
    expect(await errOf(rpc(P1, 'noct_claim', ev.id, 'harvest', 'visit:square', randomUUID()))).toMatch(/case_not_allowed/);
    expect(await errOf(rpc(P3, 'noct_event_state', ev.id))).toMatch(/not_member/);
  });

  it('validates claims: unknown ids, prerequisites, idempotency', async () => {
    expect((await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'clue:not_a_clue', randomUUID())).code).toBe('unknown_reward');
    expect((await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'puzzle:p_code', randomUUID())).code).toBe('invalid_reward');
    expect((await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'clue:breaker', randomUUID())).code).toBe('prerequisites_missing');
    const tx = randomUUID();
    const a = await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'visit:station', tx);
    expect(a).toMatchObject({ ok: true, code: 'ok', score: 10 });
    expect((await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'visit:station', randomUUID())).code).toBe('already');
    expect((await rpc(P1, 'noct_claim', ev.id, 'broadcast', 'clue:log', tx)).code).toBe('duplicate_tx');
    expect((await rpc(P1, 'noct_event_state', ev.id)).score).toBe(10);
  });

  it('checks puzzle answers on the server', async () => {
    expect((await rpc(P1, 'noct_solve', ev.id, 'broadcast', 'p_code', JSON.stringify('1962'), randomUUID())).code).toBe('prerequisites_missing');
    for (const r of ['clue:report', 'visit:market', 'clue:freezer']) await rpc(P1, 'noct_claim', ev.id, 'broadcast', r, randomUUID());
    expect((await rpc(P1, 'noct_solve', ev.id, 'broadcast', 'p_outage', JSON.stringify('hale'), randomUUID())).code).toBe('wrong');
    expect((await rpc(P1, 'noct_solve', ev.id, 'broadcast', 'p_outage', JSON.stringify('freezer'), randomUUID())).code).toBe('ok');
  });

  it('runs the hint economy server-side with exact costs', async () => {
    const s0 = await rpc(P1, 'noct_event_state', ev.id);
    expect((await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 2, randomUUID())).code).toBe('previous_level_first');
    const tx = randomUUID();
    const b1 = await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 1, tx);
    expect(b1).toMatchObject({ ok: true, code: 'purchased', cost: 20 });
    expect((await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 1, tx)).code).toBe('duplicate_tx');
    expect((await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 1, randomUUID())).code).toBe('already_purchased');
    expect((await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_code', 1, randomUUID())).code).toBe('hint_unavailable');
    const b2 = await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 2, randomUUID());
    expect(b2.balance).toBe(b1.balance - 35);
    const b3 = await rpc(P1, 'noct_buy_hint', ev.id, 'broadcast', 'p_outage', 3, randomUUID());
    if (b2.balance < 50) expect(b3).toMatchObject({ ok: false, code: 'insufficient' });
    const s1 = await rpc(P1, 'noct_event_state', ev.id);
    expect(s1.score).toBe(s0.score); // hints never reduce the score
  });

  it('pauses and resumes', async () => {
    await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'paused');
    expect(await errOf(rpc(P2, 'noct_claim', ev.id, 'broadcast', 'visit:station', randomUUID()))).toMatch(/event_paused/);
    await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'active');
    expect((await rpc(P2, 'noct_claim', ev.id, 'broadcast', 'visit:station', randomUUID())).ok).toBe(true);
  });

  it('rate-limits bursts of game actions', async () => {
    await db.exec("set noct.rate_limit = '3'");
    const codes = [];
    for (const r of ['visit:newspaper', 'visit:police', 'visit:market', 'clue:log']) codes.push(await errOf(rpc(P2, 'noct_claim', ev.id, 'broadcast', r, randomUUID())));
    await db.exec("set noct.rate_limit = '100000'"); // the scripted playthrough below is far faster than a person
    expect(codes.some((c) => /rate_limited/.test(c ?? ''))).toBe(true);
  });

  it('accepts a full case played through the API and matches the game engine score', async () => {
    const def = caseById('house');
    let p = newProgress(def, 1, null, 0);
    for (const [type, a, b] of def.walkthrough) {
      const action =
        type === 'visit' ? { type, loc: a } : type === 'interact' ? { type, obj: a } : type === 'use' ? { type, item: a, obj: b }
          : type === 'solve' ? { type, puzzle: a, answer: b } : type === 'connect' ? { type, a, b } : { type: 'final', answers: a };
      const res = act(def, p, action);
      p = res.p;
      for (const reward of res.r.gained.rewards) {
        let out;
        if (reward.startsWith('puzzle:')) {
          // the Darija spelling is accepted by the server too
          const answer = a === 'c_word' ? 'درب الدرّازة' : b;
          out = await rpc(P1, 'noct_solve', ev.id, 'house', a, JSON.stringify(answer), randomUUID());
        } else if (reward.startsWith('complete:')) out = await rpc(P1, 'noct_complete', ev.id, 'house', JSON.stringify(a), randomUUID());
        else out = await rpc(P1, 'noct_claim', ev.id, 'house', reward, randomUUID());
        expect(out.ok, `${reward}: ${out.code}`).toBe(true);
      }
      for (const f of res.r.gained.flags) expect((await rpc(P1, 'noct_claim', ev.id, 'house', `flag:${f}`, randomUUID())).ok).toBe(true);
    }
    const state = await rpc(P1, 'noct_event_state', ev.id);
    expect(state.completions.house).toBe('strong');
    // read directly as the database owner (no client role can read the table, admins included)
    const houseScore = (await db.query("select sum(score)::int as s from noct.claims c join noct.members m on m.id = c.member_id where m.user_id = $1 and c.case_id = 'house'", [P1])).rows[0].s;
    expect(houseScore).toBe(scoreOf(def, p));
  });

  it('grades an unsupported conclusion as incomplete without awarding points', async () => {
    const out = await rpc(P2, 'noct_complete', ev.id, 'broadcast', JSON.stringify({ q_what: 'grid' }), randomUUID());
    expect(out.code).toBe('prerequisites_missing');
  });

  it('builds a deterministic leaderboard without private identifiers', async () => {
    const lb = await rpc(P2, 'noct_leaderboard', ev.id);
    expect(lb[0].display_name).toBe('Amal');
    expect(lb.map((r) => r.rank)).toEqual([1, 2]);
    expect(Object.keys(lb[0]).sort()).toEqual(['cases_completed', 'display_name', 'is_me', 'rank', 'score']);
    expect(lb.find((r) => r.display_name === 'Badr').is_me).toBe(true);
    expect(JSON.stringify(lb)).not.toMatch(/0000-4000/);
    expect(await errOf(rpc(P3, 'noct_leaderboard', ev.id))).toMatch(/not_member/);
  });

  it('lets only admins reset a participant, with an audit trail', async () => {
    const detail = await rpc(ADMIN, 'noct_admin_event_detail', ev.id);
    const badr = detail.members.find((m) => m.display_name === 'Badr');
    expect(await errOf(rpc(P1, 'noct_admin_reset_member', ev.id, badr.id, null))).toMatch(/not_authorized/);
    expect((await rpc(ADMIN, 'noct_admin_reset_member', ev.id, badr.id, null)).ok).toBe(true);
    const audit = await rpc(ADMIN, 'noct_admin_audit', ev.id);
    expect(audit.map((x) => x.action)).toEqual(expect.arrayContaining(['event_created', 'status_changed', 'member_joined', 'member_reset', 'case_completed']));
    const exp = await rpc(ADMIN, 'noct_admin_export', ev.id);
    expect(Object.keys(exp[0]).sort()).toEqual(['cases_completed', 'display_name', 'is_me', 'rank', 'score']);
  });

  it('closes the event for good', async () => {
    expect((await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'completed')).ok).toBe(true);
    expect(await errOf(rpc(P1, 'noct_claim', ev.id, 'broadcast', 'clue:log', randomUUID()))).toMatch(/event_not_active/);
    expect((await rpc(ADMIN, 'noct_admin_set_status', ev.id, 'active')).code).toBe('invalid_transition');
    expect((await rpc(P3, 'noct_join', 'HOLLOW31', 'Late')).code).toBe('event_completed');
  });
});

describe('answer normalization parity', () => {
  it('normalizes like the client', async () => {
    const { normalizeAnswer, stripWords } = await import('../src/game/normalize.js');
    const filler = ['rue', 'des', 'lane', 'زنقة', 'زقاق', 'درب'];
    for (const s of ['Rue des Tisserands', 'Weavers’ Lane', 'زقاق النسّاجين', 'درب الدرّازة', 'إدريس', '١٩٨٧', 'Élan, «Test»!']) {
      const server = await db.query('select noct.normalize_answer($1, $2) as n', [s, filler]);
      expect(server.rows[0].n).toBe(stripWords(normalizeAnswer(s), filler));
    }
  });
});
