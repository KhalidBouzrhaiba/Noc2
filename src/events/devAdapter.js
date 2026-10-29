// DEVELOPMENT SIMULATION of the event backend — `npm run dev` only.
// Data stays in this browser's localStorage. There is NO security here: any "admin" sign-in
// is accepted. It exists so the event and admin interfaces can be exercised without a server.
// It mirrors the rules of supabase/migrations/001_noctaviae.sql using the same canonical data.
import { ApiError } from './api.js';
import { buildCanon } from './canon.js';
import { canTransition, joinable, rankRows, validName, cleanName, cleanCode, validateEventInput } from './rules.js';
import { caseById } from '../content/index.js';
import { checkAnswer, gradeFinal } from '../game/engine.js';

const KEY = 'noctaviae:devsim';
const USER = 'noctaviae:devsim:user';
const ADMIN = 'noctaviae:devsim:admin';
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const now = () => new Date().toISOString();
const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const canonCache = new Map();
const canon = (caseId) => {
  if (!canonCache.has(caseId)) canonCache.set(caseId, buildCanon(caseById(caseId)));
  return canonCache.get(caseId);
};

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? empty();
  } catch {
    return empty();
  }
}
function empty() {
  return { events: [], members: [], claims: [], hints: [], completions: [], audit: [] };
}
function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function condOk(c, claims) {
  if (!c) return true;
  if (c.all) return c.all.every((x) => condOk(x, claims));
  if (c.any) return c.any.some((x) => condOk(x, claims));
  if (c.not) return !condOk(c.not, claims);
  const [k, v] = Object.entries(c)[0];
  const map = { clue: 'clue', item: 'item', holding: 'item', used: 'item', puzzle: 'puzzle', deduction: 'deduction', visited: 'visit', flag: 'flag' };
  if (k === 'seen') return true;
  return claims.includes(`${map[k]}:${v}`);
}

export function createDevApi() {
  const me = () => {
    let u = localStorage.getItem(USER);
    if (!u) {
      u = uuid();
      localStorage.setItem(USER, u);
    }
    return u;
  };
  const isAdmin = () => localStorage.getItem(ADMIN) === me();
  const requireAdmin = () => {
    if (!isAdmin()) throw new ApiError('not_authorized');
  };
  const memberOf = (db, eventId) => db.members.find((m) => m.event_id === eventId && m.user_id === me());
  const audit = (db, event_id, action, extra = {}) => db.audit.push({ id: uuid(), event_id, actor: me(), action, created_at: now(), details: {}, ...extra });
  const claimsOf = (db, memberId, caseId) => db.claims.filter((c) => c.member_id === memberId && c.case_id === caseId).map((c) => c.reward_id);
  const score = (db, memberId) => db.claims.filter((c) => c.member_id === memberId).reduce((s, c) => s + c.score, 0);
  const balance = (db, ev, m, caseId) =>
    ev.start_balance +
    db.claims.filter((c) => c.member_id === m.id && c.case_id === caseId).reduce((s, c) => s + c.hint, 0) -
    db.hints.filter((h) => h.member_id === m.id && h.case_id === caseId).reduce((s, h) => s + h.cost, 0);

  function active(db, eventId, caseId) {
    const m = memberOf(db, eventId);
    if (!m) throw new ApiError('not_member');
    const ev = db.events.find((e) => e.id === eventId);
    if (ev.status === 'paused') throw new ApiError('event_paused');
    if (ev.status !== 'active') throw new ApiError('event_not_active');
    if (ev.ends_at && Date.now() > new Date(ev.ends_at).getTime()) throw new ApiError('event_ended');
    if (caseId && !ev.allowed_cases.includes(caseId)) throw new ApiError('case_not_allowed');
    return { m, ev };
  }
  function insertClaim(db, m, caseId, reward, tx) {
    if (db.claims.some((c) => c.member_id === m.id && c.tx === tx)) return 'duplicate_tx';
    if (db.claims.some((c) => c.member_id === m.id && c.case_id === caseId && c.reward_id === reward)) return 'already';
    const r = canon(caseId).rewards.find((x) => x.reward_id === reward) ?? canon(caseId).puzzles.map((p) => ({ reward_id: `puzzle:${p.puzzle_id}`, score: p.score, hint: p.hint })).find((x) => x.reward_id === reward);
    db.claims.push({ id: uuid(), event_id: m.event_id, member_id: m.id, case_id: caseId, reward_id: reward, score: r?.score ?? 0, hint: r?.hint ?? 0, tx, created_at: now() });
    return 'ok';
  }
  const eventJson = (db, e) => ({ ...e, participants: db.members.filter((m) => m.event_id === e.id).length });

  function leaderboardRows(db, eventId) {
    const rows = db.members
      .filter((m) => m.event_id === eventId)
      .map((m) => {
        const mine = db.claims.filter((c) => c.member_id === m.id && c.score > 0);
        return {
          id: m.id,
          display_name: m.display_name,
          joined_at: m.joined_at,
          score: score(db, m.id),
          cases_completed: db.completions.filter((x) => x.member_id === m.id).length,
          reached_at: mine.length ? mine.map((c) => c.created_at).sort().at(-1) : m.joined_at,
          is_me: m.user_id === me(),
        };
      });
    return rankRows(rows).map(({ rank, display_name, score: s, cases_completed, is_me }) => ({ rank, display_name, score: s, cases_completed, is_me }));
  }

  const api = {
    mode: 'dev',
    async session() {
      return { userId: me(), anonymous: !isAdmin(), email: isAdmin() ? 'dev@local' : null };
    },
    async ensurePlayer() {
      return this.session();
    },
    async signInAdmin() {
      await wait();
      localStorage.setItem(ADMIN, me());
      return this.session();
    },
    async signOut() {
      localStorage.removeItem(ADMIN);
    },
    async join(code, name) {
      await wait();
      const db = load();
      const nm = cleanName(name);
      if (!validName(nm)) return { ok: false, code: 'invalid_name' };
      const ev = db.events.find((e) => e.access_code === cleanCode(code));
      if (!ev) return { ok: false, code: 'unknown_code' };
      const existing = memberOf(db, ev.id);
      if (existing) return { ok: true, code: 'rejoined', event_id: ev.id, member_id: existing.id, display_name: existing.display_name };
      if (!joinable(ev.status)) return { ok: false, code: `event_${ev.status}` };
      if (db.members.filter((m) => m.event_id === ev.id).length >= ev.max_participants) return { ok: false, code: 'event_full' };
      if (db.members.some((m) => m.event_id === ev.id && m.display_name.toLowerCase() === nm.toLowerCase())) return { ok: false, code: 'name_taken' };
      const m = { id: uuid(), event_id: ev.id, user_id: me(), display_name: nm, joined_at: now() };
      db.members.push(m);
      audit(db, ev.id, 'member_joined', { target_member: m.id });
      save(db);
      return { ok: true, code: 'joined', event_id: ev.id, member_id: m.id, display_name: nm };
    },
    async myEvents() {
      await wait(20);
      const db = load();
      return db.members.filter((m) => m.user_id === me()).map((m) => {
        const e = db.events.find((x) => x.id === m.event_id);
        return { event_id: e.id, name: e.name, status: e.status, member_id: m.id, display_name: m.display_name };
      });
    },
    async state(eventId) {
      await wait(20);
      const db = load();
      const m = memberOf(db, eventId);
      if (!m && !isAdmin()) throw new ApiError('not_member');
      const e = db.events.find((x) => x.id === eventId);
      const claims = {};
      for (const c of db.claims.filter((x) => x.member_id === m?.id)) (claims[c.case_id] ??= []).push(c.reward_id);
      return {
        event: { id: e.id, name: e.name, description: e.description, status: e.status, starts_at: e.starts_at, ends_at: e.ends_at, allowed_cases: e.allowed_cases, hint_costs: e.hint_costs, start_balance: e.start_balance },
        member: m ? { id: m.id, display_name: m.display_name } : null,
        score: m ? score(db, m.id) : 0,
        claims,
        hints: db.hints.filter((h) => h.member_id === m?.id).map((h) => ({ case: h.case_id, target: h.target, level: h.level, cost: h.cost })),
        completions: Object.fromEntries(db.completions.filter((x) => x.member_id === m?.id).map((x) => [x.case_id, x.outcome])),
      };
    },
    async claim(eventId, caseId, reward, tx) {
      await wait(30);
      const db = load();
      const { m } = active(db, eventId, caseId);
      if (!/^(visit|clue|item|deduction|flag):[a-z0-9_]{1,40}$/.test(reward)) return { ok: false, code: 'invalid_reward' };
      const r = canon(caseId).rewards.find((x) => x.reward_id === reward);
      if (!r) return { ok: false, code: 'unknown_reward' };
      if (!condOk(r.requires, claimsOf(db, m.id, caseId))) return { ok: false, code: 'prerequisites_missing' };
      const code = insertClaim(db, m, caseId, reward, tx);
      save(db);
      return { ok: true, code, score: score(db, m.id) };
    },
    async solve(eventId, caseId, puzzle, answer, tx) {
      await wait(30);
      const db = load();
      const { m } = active(db, eventId, caseId);
      const pz = caseById(caseId).puzzles[puzzle];
      if (!pz) return { ok: false, code: 'unknown_puzzle' };
      const cl = claimsOf(db, m.id, caseId);
      if (cl.includes(`puzzle:${puzzle}`)) return { ok: true, code: 'already', score: score(db, m.id) };
      if (!condOk(pz.requires, cl)) return { ok: false, code: 'prerequisites_missing' };
      if (!checkAnswer(pz, answer).correct) return { ok: false, code: 'wrong' };
      const code = insertClaim(db, m, caseId, `puzzle:${puzzle}`, tx);
      save(db);
      return { ok: true, code, score: score(db, m.id) };
    },
    async buyHint(eventId, caseId, target, level, tx) {
      await wait(60);
      const db = load();
      const { m, ev } = active(db, eventId, caseId);
      if (![1, 2, 3].includes(level)) return { ok: false, code: 'unknown_hint' };
      if (db.hints.some((h) => h.member_id === m.id && h.tx === tx)) return { ok: true, code: 'duplicate_tx', balance: balance(db, ev, m, caseId) };
      if (db.hints.some((h) => h.member_id === m.id && h.case_id === caseId && h.target === target && h.level === level)) return { ok: true, code: 'already_purchased', balance: balance(db, ev, m, caseId) };
      const def = caseById(caseId);
      const req = target === 'final' ? def.final.requires : def.puzzles[target]?.requires;
      if (target !== 'final' && !def.puzzles[target]) return { ok: false, code: 'unknown_hint' };
      const cl = claimsOf(db, m.id, caseId);
      if (!condOk(req, cl) && !cl.includes(`puzzle:${target}`)) return { ok: false, code: 'hint_unavailable' };
      if (level > 1 && !db.hints.some((h) => h.member_id === m.id && h.case_id === caseId && h.target === target && h.level === level - 1)) return { ok: false, code: 'previous_level_first' };
      const cost = ev.hint_costs[level - 1];
      const bal = balance(db, ev, m, caseId);
      if (bal < cost) return { ok: false, code: 'insufficient', balance: bal, cost };
      db.hints.push({ id: uuid(), event_id: eventId, member_id: m.id, case_id: caseId, target, level, cost, tx, created_at: now() });
      save(db);
      return { ok: true, code: 'purchased', cost, balance: bal - cost };
    },
    async complete(eventId, caseId, answers, tx) {
      await wait(60);
      const db = load();
      const { m } = active(db, eventId, caseId);
      if (db.completions.some((x) => x.member_id === m.id && x.case_id === caseId)) return { ok: true, code: 'already', score: score(db, m.id) };
      const def = caseById(caseId);
      const cl = claimsOf(db, m.id, caseId);
      if (!condOk(def.final.requires, cl)) return { ok: false, code: 'prerequisites_missing' };
      const pseudo = { clues: cl.filter((c) => c.startsWith('clue:')).map((c) => c.slice(5)), deductions: cl.filter((c) => c.startsWith('deduction:')).map((c) => c.slice(10)) };
      const g = gradeFinal(def, pseudo, answers);
      if (g.empty || g.outcome === 'incomplete') return { ok: false, code: 'incomplete' };
      db.completions.push({ member_id: m.id, case_id: caseId, outcome: g.outcome, created_at: now() });
      db.claims.push({ id: uuid(), event_id: eventId, member_id: m.id, case_id: caseId, reward_id: `complete:${g.outcome}`, score: canon(caseId).final.completion[g.outcome], hint: 0, tx, created_at: now() });
      audit(db, eventId, 'case_completed', { target_member: m.id, details: { case: caseId, outcome: g.outcome } });
      save(db);
      return { ok: true, code: 'completed', outcome: g.outcome, score: score(db, m.id) };
    },
    async leaderboard(eventId) {
      await wait(40);
      const db = load();
      if (!memberOf(db, eventId) && !isAdmin()) throw new ApiError('not_member');
      return leaderboardRows(db, eventId);
    },
    admin: {
      async whoami() {
        return { user_id: me(), is_admin: isAdmin() };
      },
      async events() {
        requireAdmin();
        const db = load();
        return db.events.map((e) => eventJson(db, e)).sort((a, b) => b.created_at.localeCompare(a.created_at));
      },
      async saveEvent(id, p) {
        await wait();
        requireAdmin();
        const db = load();
        if (!id) {
          const e = {
            id: uuid(), name: p.name, description: p.description ?? '', status: 'draft', starts_at: p.starts_at ?? null, ends_at: p.ends_at ?? null,
            access_code: cleanCode(p.access_code || uuid().replace(/-/g, '').slice(0, 8)), allowed_cases: p.allowed_cases ?? ['broadcast', 'harvest', 'house'],
            hint_costs: p.hint_costs ?? [20, 35, 50], start_balance: p.start_balance ?? 40, max_participants: p.max_participants ?? 200, created_at: now(), updated_at: now(),
          };
          if (validateEventInput(e).length) return { ok: false, code: 'invalid_event' };
          if (db.events.some((x) => x.access_code === e.access_code)) return { ok: false, code: 'code_taken' };
          db.events.push(e);
          audit(db, e.id, 'event_created', { details: { name: e.name } });
          save(db);
          return { ok: true, event: eventJson(db, e) };
        }
        const e = db.events.find((x) => x.id === id);
        if (!e) return { ok: false, code: 'unknown_event' };
        if (['completed', 'cancelled'].includes(e.status)) return { ok: false, code: 'event_closed' };
        const next = { ...e, ...p, access_code: e.access_code, updated_at: now() };
        if (validateEventInput(next).length) return { ok: false, code: 'invalid_event' };
        Object.assign(e, next);
        audit(db, id, 'event_updated', { details: p });
        save(db);
        return { ok: true, event: eventJson(db, e) };
      },
      async setStatus(id, status) {
        await wait();
        requireAdmin();
        const db = load();
        const e = db.events.find((x) => x.id === id);
        if (!e) return { ok: false, code: 'unknown_event' };
        if (!canTransition(e.status, status)) return { ok: false, code: 'invalid_transition', from: e.status, to: status };
        e.status = status;
        e.updated_at = now();
        audit(db, id, 'status_changed', { details: { to: status } });
        save(db);
        return { ok: true, event: eventJson(db, e) };
      },
      async detail(id) {
        await wait(30);
        requireAdmin();
        const db = load();
        const e = db.events.find((x) => x.id === id);
        if (!e) return { ok: false, code: 'unknown_event' };
        const members = db.members.filter((m) => m.event_id === id);
        const completions = {};
        const puzzles = {};
        for (const m of members) {
          for (const x of db.completions.filter((c) => c.member_id === m.id)) completions[x.case_id] = (completions[x.case_id] ?? 0) + 1;
          for (const c of db.claims.filter((c) => c.member_id === m.id && c.reward_id.startsWith('puzzle:'))) {
            const k = `${c.case_id}/${c.reward_id.slice(7)}`;
            puzzles[k] = (puzzles[k] ?? 0) + 1;
          }
        }
        return {
          ok: true,
          event: eventJson(db, e),
          members: members.map((m) => ({
            id: m.id,
            display_name: m.display_name,
            joined_at: m.joined_at,
            score: score(db, m.id),
            puzzles: db.claims.filter((c) => c.member_id === m.id && c.reward_id.startsWith('puzzle:')).length,
            hints: db.hints.filter((h) => h.member_id === m.id).length,
            completed: Object.fromEntries(db.completions.filter((x) => x.member_id === m.id).map((x) => [x.case_id, x.outcome])),
            last_activity: db.claims.filter((c) => c.member_id === m.id).map((c) => c.created_at).sort().at(-1) ?? null,
          })),
          stats: { participants: members.length, completions, puzzles },
        };
      },
      async audit(id) {
        requireAdmin();
        const db = load();
        return db.audit
          .filter((a) => a.event_id === id)
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .slice(0, 300)
          .map((a) => ({ at: a.created_at, action: a.action, details: a.details, member: db.members.find((m) => m.id === a.target_member)?.display_name ?? null, by_admin: a.actor === localStorage.getItem(ADMIN) }));
      },
      async exportRows(id) {
        requireAdmin();
        const db = load();
        audit(db, id, 'results_exported');
        save(db);
        return leaderboardRows(db, id);
      },
      async resetMember(id, member, caseId = null) {
        await wait();
        requireAdmin();
        const db = load();
        if (!db.members.some((m) => m.id === member && m.event_id === id)) return { ok: false, code: 'unknown_member' };
        const keep = (x) => !(x.member_id === member && (caseId == null || x.case_id === caseId));
        db.claims = db.claims.filter(keep);
        db.hints = db.hints.filter(keep);
        db.completions = db.completions.filter(keep);
        audit(db, id, 'member_reset', { target_member: member, details: { case: caseId ?? 'all' } });
        save(db);
        return { ok: true };
      },
    },
  };
  return api;
}
