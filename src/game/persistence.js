// Browser-local persistence. One record per case ("noctaviae:case:<id>"), plus settings and
// the active session. This is a solo, single-device save — not a cloud save.
import { SAVE_VERSION, newProgress, isUnlocked } from './engine.js';

const PREFIX = 'noctaviae:';
export const KEYS = {
  settings: `${PREFIX}settings`,
  session: `${PREFIX}session`,
  // Solo saves use "noctaviae:case:<id>"; event play uses "noctaviae:<scope>:case:<id>".
  case: (id, scope = 'solo') => (scope === 'solo' ? `${PREFIX}case:${id}` : `${PREFIX}${scope}:case:${id}`),
};

export function createStore(storage) {
  const s = storage ?? (typeof window !== 'undefined' ? safeLocalStorage() : null);
  return {
    available: !!s,
    read(key) {
      if (!s) return { ok: false, error: 'unavailable' };
      try {
        const raw = s.getItem(key);
        if (raw == null) return { ok: true, value: null };
        return { ok: true, value: JSON.parse(raw) };
      } catch (e) {
        return { ok: false, error: 'malformed', raw: safeGet(s, key) };
      }
    },
    write(key, value) {
      if (!s) return { ok: false, error: 'unavailable' };
      try {
        s.setItem(key, JSON.stringify(value));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e?.name === 'QuotaExceededError' ? 'quota' : 'write_failed' };
      }
    },
    remove(key) {
      if (!s) return { ok: false, error: 'unavailable' };
      try {
        s.removeItem(key);
        return { ok: true };
      } catch {
        return { ok: false, error: 'write_failed' };
      }
    },
  };
}

function safeLocalStorage() {
  try {
    const t = '__noctaviae_probe__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    return null;
  }
}
function safeGet(s, key) {
  try {
    return s.getItem(key);
  } catch {
    return null;
  }
}

// Migrations from older save versions. Add `n: (data) => data` steps as the schema evolves.
const MIGRATIONS = {};

/**
 * Validate (and if needed repair) a stored progress record against the case definition.
 * Returns { status: 'ok' | 'repaired' | 'invalid' | 'empty', p?, problems[] }.
 */
export function validateProgress(def, raw) {
  const problems = [];
  if (raw == null) return { status: 'empty', problems };
  if (typeof raw !== 'object' || Array.isArray(raw)) return { status: 'invalid', problems: ['not_an_object'] };
  let data = raw;
  let v = Number(data.v);
  if (!Number.isInteger(v)) return { status: 'invalid', problems: ['no_version'] };
  if (v > SAVE_VERSION) return { status: 'invalid', problems: ['newer_version'] };
  while (v < SAVE_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) return { status: 'invalid', problems: [`no_migration_from_${v}`] };
    data = step(data);
    v += 1;
    problems.push(`migrated_to_${v}`);
  }
  if (data.caseId !== def.id) return { status: 'invalid', problems: ['case_mismatch'] };

  const base = newProgress(def, 1, null, Number.isFinite(data.startedAt) ? data.startedAt : Date.now());
  const p = { ...base };
  const ids = (arr, valid, name) => {
    if (!Array.isArray(arr)) {
      if (arr !== undefined) problems.push(`${name}_not_array`);
      return [];
    }
    const out = [...new Set(arr.filter((x) => typeof x === 'string' && valid(x)))];
    if (out.length !== arr.length) problems.push(`${name}_filtered`);
    return out;
  };
  const locIds = new Set(def.locations.map((l) => l.id));
  const objIds = new Set(def.objects.map((o) => o.id));
  const dedIds = new Set(def.deductions.map((d) => d.id));

  p.run = Number.isInteger(data.run) && data.run > 0 ? data.run : 1;
  p.best = data.best && Number.isFinite(data.best.score) ? data.best : null;
  p.updatedAt = Number.isFinite(data.updatedAt) ? data.updatedAt : p.startedAt;
  p.playMs = Number.isFinite(data.playMs) && data.playMs >= 0 ? data.playMs : 0;
  p.visited = ids(data.visited, (x) => locIds.has(x), 'visited');
  p.clues = ids(data.clues, (x) => !!def.clues[x], 'clues');
  p.items = ids(data.items, (x) => !!def.items[x], 'items');
  p.used = ids(data.used, (x) => p.items.includes(x), 'used');
  p.flags = ids(data.flags, (x) => x.length < 64, 'flags');
  p.solved = ids(data.solved, (x) => !!def.puzzles[x], 'solved');
  p.deductions = ids(data.deductions, (x) => dedIds.has(x), 'deductions');
  p.claimed = ids(data.claimed, (x) => /^(visit|clue|item|puzzle|deduction|complete):[\w-]+$/.test(x), 'claimed');
  p.seen = {};
  if (data.seen && typeof data.seen === 'object') {
    for (const [k, val] of Object.entries(data.seen)) if (objIds.has(k) && Number.isInteger(val) && val >= 0) p.seen[k] = val;
  }
  p.attempts = {};
  if (data.attempts && typeof data.attempts === 'object') {
    for (const [k, val] of Object.entries(data.attempts)) if (Number.isInteger(val) && val >= 0) p.attempts[k] = val;
  }
  p.hints = Array.isArray(data.hints)
    ? data.hints.filter(
        (h) => h && (def.puzzles[h.puzzle] || h.puzzle === 'final') && [1, 2, 3].includes(h.level) && Number.isFinite(h.cost) && h.cost >= 0,
      )
    : [];
  if (Array.isArray(data.hints) && p.hints.length !== data.hints.length) problems.push('hints_filtered');
  // keep only one record per (puzzle, level)
  const seenHint = new Set();
  p.hints = p.hints.filter((h) => {
    const k = `${h.puzzle}:${h.level}`;
    if (seenHint.has(k)) return false;
    seenHint.add(k);
    return true;
  });
  p.final = data.final && typeof data.final === 'object' ? data.final : null;
  // Completion must be backed by its recorded completion claim; a bare flag is not trusted.
  p.completed = data.completed === true && ['strong', 'partial'].includes(data.outcome) && p.claimed.includes(`complete:${data.outcome}`);
  p.outcome = p.completed ? data.outcome : null;
  if (data.completed && !p.completed) problems.push('completion_invalid');
  p.loc = typeof data.loc === 'string' && locIds.has(data.loc) ? data.loc : def.start;
  if (!isUnlocked(def, p, p.loc)) {
    problems.push('location_locked');
    p.loc = def.start;
  }
  return { status: problems.some((x) => !x.startsWith('migrated')) ? 'repaired' : 'ok', p, problems };
}

export function loadCase(store, def, scope = 'solo') {
  const res = store.read(KEYS.case(def.id, scope));
  if (!res.ok) return { status: res.error === 'malformed' ? 'invalid' : 'unavailable', problems: [res.error] };
  return validateProgress(def, res.value);
}

export const saveCase = (store, p, scope = 'solo') => store.write(KEYS.case(p.caseId, scope), p);
export const deleteCase = (store, caseId, scope = 'solo') => store.remove(KEYS.case(caseId, scope));
