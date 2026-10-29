// The game rules. `act(def, progress, action, cfg)` is a pure function: it never mutates
// its input and returns { p: nextProgress, r: result }. All derived values (score, hint
// balance, unlocked locations, objectives) are computed from the stored facts, so they
// cannot drift out of sync.
import { check } from './conditions.js';
import { DEFAULT_CONFIG } from './config.js';
import { normalizeAnswer, stripWords } from './normalize.js';

export const SAVE_VERSION = 1;

export function newProgress(def, run = 1, best = null, now = Date.now()) {
  return {
    v: SAVE_VERSION,
    caseId: def.id,
    run,
    best,
    startedAt: now,
    updatedAt: now,
    playMs: 0,
    loc: def.start,
    visited: [],
    seen: {}, // objectId -> index of the description state last shown
    clues: [],
    items: [],
    used: [],
    flags: [],
    solved: [],
    attempts: {},
    deductions: [],
    claimed: [],
    hints: [], // { puzzle, level, cost, tx, at }
    final: null, // last submitted final deduction { answers, outcome, feedback, at }
    completed: false,
    outcome: null,
  };
}

// ───────────────────────── Lookups & derived state

export const objectById = (def, id) => def.objects.find((o) => o.id === id);
export const locationById = (def, id) => def.locations.find((l) => l.id === id);

export function unlockedLocations(def, p) {
  return def.locations.filter((l) => check(l.unlock, p)).map((l) => l.id);
}
export const isUnlocked = (def, p, loc) => {
  const l = locationById(def, loc);
  return !!l && check(l.unlock, p);
};

export const isVisible = (o, p) => check(o.show, p);

/** Index of the description state that currently applies (last matching wins). */
export function stateIndex(o, p) {
  if (!Array.isArray(o.text)) return 0;
  let idx = 0;
  o.text.forEach((s, i) => {
    if (check(s.if, p)) idx = i;
  });
  return idx;
}
export function objectText(o, p) {
  return Array.isArray(o.text) ? o.text[stateIndex(o, p)].text : o.text;
}

export function puzzleAvailable(def, p, id) {
  const pz = def.puzzles[id];
  return !!pz && check(pz.requires, p);
}

/** Reward value lookup. Reward ids look like "visit:station", "clue:log", "puzzle:p1". */
export function rewardValue(def, id, cfg = DEFAULT_CONFIG) {
  const [kind, ref] = id.split(':');
  if (kind === 'complete') return { score: cfg.completion[ref] ?? 0, hint: 0 };
  if (kind === 'clue') {
    const c = def.clues[ref];
    return c?.optional ? cfg.rewards.optional : cfg.rewards.clue;
  }
  return cfg.rewards[kind] ?? { score: 0, hint: 0 };
}

export function scoreOf(def, p, cfg = DEFAULT_CONFIG) {
  return p.claimed.reduce((sum, id) => sum + rewardValue(def, id, cfg).score, 0);
}
export function scoreBreakdown(def, p, cfg = DEFAULT_CONFIG) {
  const out = {};
  for (const id of p.claimed) {
    let kind = id.split(':')[0];
    if (kind === 'clue' && def.clues[id.split(':')[1]]?.optional) kind = 'optional';
    out[kind] = (out[kind] ?? 0) + rewardValue(def, id, cfg).score;
  }
  return out;
}

export function hintBalance(def, p, cfg = DEFAULT_CONFIG) {
  const earned = p.claimed.reduce((sum, id) => sum + rewardValue(def, id, cfg).hint, 0);
  const spent = p.hints.reduce((sum, h) => sum + h.cost, 0);
  return cfg.hints.startBalance + earned - spent;
}

/** Hints exist for every puzzle and for the final deduction ("final"). */
export function hintTarget(def, id) {
  return id === 'final' ? def.final : def.puzzles[id] ?? null;
}

export function purchasedLevels(p, puzzle) {
  return p.hints.filter((h) => h.puzzle === puzzle).map((h) => h.level).sort();
}

/** Active objectives: not yet done, and whose `when` condition holds. */
export function activeObjectives(def, p) {
  if (p.completed) return [];
  return def.objectives.filter((o) => check(o.when, p) && !check(o.done, p));
}

/** Status flags for the map. */
export function locationStatus(def, p, locId) {
  const loc = locationById(def, locId);
  const unlocked = check(loc.unlock, p);
  const objs = def.objects.filter((o) => o.loc === locId && isVisible(o, p));
  let fresh = false;
  let leads = false;
  let optional = false;
  for (const o of objs) {
    const usable = check(o.requires, p) && (!o.puzzle || puzzleAvailable(def, p, o.puzzle));
    const seenIdx = p.seen[o.id];
    const changed = seenIdx == null || seenIdx < stateIndex(o, p);
    const unsolved = o.puzzle && !p.solved.includes(o.puzzle);
    if (usable && (changed || unsolved)) fresh = true;
    if (!o.optional && (!usable || unsolved)) leads = true;
    if (o.optional && seenIdx == null) optional = true;
  }
  return { unlocked, visited: p.visited.includes(locId), fresh: unlocked && fresh, leads: unlocked && leads, optional: unlocked && optional };
}

// ───────────────────────── Reducer

function emptyResult() {
  return { ok: true, code: 'ok', gained: { clues: [], items: [], flags: [], deductions: [], solved: [], unlocked: [], rewards: [] } };
}
const fail = (code, msg, extra = {}) => ({ ...emptyResult(), ok: false, code, msg, ...extra });

function clone(p) {
  return {
    ...p,
    visited: [...p.visited],
    seen: { ...p.seen },
    clues: [...p.clues],
    items: [...p.items],
    used: [...p.used],
    flags: [...p.flags],
    solved: [...p.solved],
    attempts: { ...p.attempts },
    deductions: [...p.deductions],
    claimed: [...p.claimed],
    hints: [...p.hints],
  };
}

function claim(n, r, id) {
  if (n.claimed.includes(id)) return;
  n.claimed.push(id);
  r.gained.rewards.push(id);
}

function grant(def, n, r, gives = {}) {
  for (const c of gives.clues ?? []) {
    if (!def.clues[c]) throw new Error(`unknown clue ${c}`);
    if (!n.clues.includes(c)) {
      n.clues.push(c);
      r.gained.clues.push(c);
      claim(n, r, `clue:${c}`);
    }
  }
  for (const i of gives.items ?? []) {
    if (!def.items[i]) throw new Error(`unknown item ${i}`);
    if (!n.items.includes(i)) {
      n.items.push(i);
      r.gained.items.push(i);
      claim(n, r, `item:${i}`);
    }
  }
  for (const f of gives.flags ?? []) {
    if (!n.flags.includes(f)) {
      n.flags.push(f);
      r.gained.flags.push(f);
    }
  }
}

export function act(def, p, action, cfg = DEFAULT_CONFIG, now = Date.now()) {
  if (p.caseId !== def.id) return { p, r: fail('wrong_case') };
  const before = unlockedLocations(def, p);
  const n = clone(p);
  let r = emptyResult();

  switch (action.type) {
    case 'visit': {
      if (!isUnlocked(def, p, action.loc)) return { p, r: fail('location_locked') };
      n.loc = action.loc;
      if (!n.visited.includes(action.loc)) {
        n.visited.push(action.loc);
        claim(n, r, `visit:${action.loc}`);
      }
      break;
    }

    case 'interact': {
      const o = objectById(def, action.obj);
      if (!o || o.loc !== p.loc || !isVisible(o, p)) return { p, r: fail('not_here') };
      if (!check(o.requires, p)) return { p, r: fail('locked', o.locked) };
      grant(def, n, r, o.gives);
      // Evaluate the description state after the grant, so the panel shows the updated text.
      n.seen[o.id] = stateIndex(o, n);
      if (o.doc) r.open = { doc: o.doc };
      if (o.puzzle) {
        if (!puzzleAvailable(def, n, o.puzzle)) {
          // Discoveries made while looking still count; only the puzzle stays closed.
          n.updatedAt = now;
          const after = unlockedLocations(def, n);
          return { p: n, r: { ...r, ok: false, code: 'locked', msg: o.locked, gained: { ...r.gained, unlocked: after.filter((l) => !before.includes(l)) } } };
        }
        r.open = { ...r.open, puzzle: o.puzzle };
      }
      break;
    }

    case 'use': {
      const o = objectById(def, action.obj);
      if (!o || o.loc !== p.loc || !isVisible(o, p)) return { p, r: fail('not_here') };
      if (!p.items.includes(action.item) || p.used.includes(action.item)) return { p, r: fail('no_item') };
      const use = (o.accepts ?? []).find((a) => a.item === action.item);
      if (!use) return { p, r: fail('incompatible', def.items[action.item].misfit ?? null) };
      if (use.requires && !check(use.requires, p)) return { p, r: fail('locked', use.locked ?? o.locked) };
      if (use.flag && p.flags.includes(use.flag)) return { p, r: fail('already_done') };
      grant(def, n, r, { ...use.gives, flags: [...(use.gives?.flags ?? []), ...(use.flag ? [use.flag] : [])] });
      if (use.consume && !n.used.includes(action.item)) n.used.push(action.item);
      n.seen[o.id] = stateIndex(o, n);
      r.msg = use.text;
      break;
    }

    case 'solve': {
      const pz = def.puzzles[action.puzzle];
      if (!pz) return { p, r: fail('unknown_puzzle') };
      if (!check(pz.requires, p)) return { p, r: fail('locked') };
      if (p.solved.includes(pz.id)) return { p, r: { ...emptyResult(), code: 'already_solved' } };
      const verdict = checkAnswer(pz, action.answer);
      if (verdict.empty) return { p, r: fail('empty') };
      if (!verdict.correct) {
        n.attempts[pz.id] = (n.attempts[pz.id] ?? 0) + 1;
        n.updatedAt = now;
        return { p: n, r: fail('wrong', verdict.msg ?? pz.wrong, { detail: verdict.detail }) };
      }
      n.solved.push(pz.id);
      r.gained.solved.push(pz.id);
      claim(n, r, `puzzle:${pz.id}`);
      grant(def, n, r, pz.gives);
      r.msg = pz.success;
      break;
    }

    case 'connect': {
      const { a, b } = action;
      if (!p.clues.includes(a) || !p.clues.includes(b) || a === b) return { p, r: fail('invalid_pair') };
      const d = def.deductions.find((x) => (x.pair[0] === a && x.pair[1] === b) || (x.pair[0] === b && x.pair[1] === a));
      if (!d) {
        n.attempts.board = (n.attempts.board ?? 0) + 1;
        return { p: n, r: fail('no_link') };
      }
      if (p.deductions.includes(d.id)) return { p, r: { ...emptyResult(), code: 'already_linked', deduction: d.id } };
      n.deductions.push(d.id);
      r.gained.deductions.push(d.id);
      r.deduction = d.id;
      claim(n, r, `deduction:${d.id}`);
      grant(def, n, r, d.gives);
      break;
    }

    case 'hint': {
      const { puzzle, level, tx } = action;
      const pz = hintTarget(def, puzzle);
      if (!pz || !pz.hints || level < 1 || level > 3) return { p, r: fail('unknown_hint') };
      if (!check(pz.requires, p) && !p.solved.includes(puzzle)) return { p, r: fail('hint_unavailable') };
      if (p.hints.some((h) => h.puzzle === puzzle && h.level === level)) return { p, r: { ...emptyResult(), code: 'already_purchased' } };
      if (tx && p.hints.some((h) => h.tx === tx)) return { p, r: { ...emptyResult(), code: 'duplicate_tx' } };
      if (level > 1 && !p.hints.some((h) => h.puzzle === puzzle && h.level === level - 1)) return { p, r: fail('previous_level_first') };
      const cost = cfg.hints.costs[level - 1];
      if (hintBalance(def, p, cfg) < cost) return { p, r: fail('insufficient', null, { cost }) };
      n.hints.push({ puzzle, level, cost, tx: tx ?? `${puzzle}:${level}:${now}`, at: now });
      r.code = 'purchased';
      r.cost = cost;
      break;
    }

    case 'final': {
      if (p.completed) return { p, r: fail('already_completed') };
      if (!check(def.final.requires, p)) return { p, r: fail('locked') };
      const g = gradeFinal(def, p, action.answers ?? {});
      if (g.empty) return { p, r: fail('empty') };
      n.final = { answers: action.answers, outcome: g.outcome, feedback: g.feedback, at: now };
      if (g.outcome === 'incomplete') {
        n.attempts.final = (n.attempts.final ?? 0) + 1;
        r = { ...r, ok: false, code: 'incomplete' };
      } else {
        n.completed = true;
        n.outcome = g.outcome;
        claim(n, r, `complete:${g.outcome}`);
        const score = scoreOf(def, n, cfg);
        if (!n.best || score > n.best.score) n.best = { score, outcome: g.outcome, at: now };
        r.code = 'completed';
      }
      r.grade = g;
      break;
    }

    case 'time': {
      const ms = Math.max(0, Math.min(60000, Number(action.ms) || 0));
      n.playMs += ms;
      return { p: n, r: emptyResult() };
    }

    default:
      return { p, r: fail('unknown_action') };
  }

  n.updatedAt = now;
  const after = unlockedLocations(def, n);
  r.gained.unlocked = after.filter((l) => !before.includes(l));
  return { p: n, r };
}

// ───────────────────────── Puzzle checking

export function checkAnswer(pz, answer) {
  switch (pz.type) {
    case 'choice': {
      if (!answer) return { empty: true };
      const opt = pz.options.find((o) => o.id === answer);
      return { correct: answer === pz.answer, msg: opt?.why };
    }
    case 'multi': {
      const a = [...new Set(answer ?? [])];
      if (!a.length) return { empty: true };
      const want = new Set(pz.answer);
      const hits = a.filter((x) => want.has(x)).length;
      const extra = a.length - hits;
      return {
        correct: hits === want.size && extra === 0,
        detail: { missing: want.size - hits, extra },
      };
    }
    case 'order': {
      if (!Array.isArray(answer) || answer.length !== pz.answer.length) return { empty: true };
      const inPlace = answer.filter((x, i) => pz.answer[i] === x).length;
      return { correct: inPlace === pz.answer.length, detail: { correct: inPlace, total: pz.answer.length } };
    }
    case 'code': {
      const a = normalizeAnswer(answer).replace(/\s/g, '');
      if (!a) return { empty: true };
      return { correct: a === pz.answer };
    }
    case 'word': {
      const a = stripWords(normalizeAnswer(answer), pz.filler);
      if (!a) return { empty: true };
      const ok = Object.values(pz.answers).flat().some((w) => stripWords(normalizeAnswer(w), pz.filler) === a);
      return { correct: ok };
    }
    case 'classify':
    case 'match': {
      const a = answer ?? {};
      const keys = Object.keys(pz.answer);
      if (keys.some((k) => !a[k])) return { empty: true };
      const right = keys.filter((k) => a[k] === pz.answer[k]).length;
      return { correct: right === keys.length, detail: { correct: right, total: keys.length } };
    }
    default:
      throw new Error(`unknown puzzle type ${pz.type}`);
  }
}

// ───────────────────────── Final deduction

export function gradeFinal(def, p, answers) {
  const F = def.final;
  const feedback = {};
  let empty = true;
  let coreOk = true;
  let allOk = true;
  for (const q of F.questions) {
    const a = answers[q.id];
    let ok;
    if (q.type === 'evidence') {
      const picked = (a ?? []).filter((c) => p.clues.includes(c));
      if (picked.length) empty = false;
      const missing = q.required.filter((c) => !picked.includes(c));
      const weak = picked.filter((c) => def.clues[c]?.status === 'rumor');
      ok = missing.length === 0 && weak.length === 0;
      feedback[q.id] = { ok, missing: missing.length, weak: weak.length };
    } else {
      if (a != null && (!Array.isArray(a) || a.length)) empty = false;
      ok = q.type === 'order' ? Array.isArray(a) && a.join('|') === q.answer.join('|') : a === q.answer;
      feedback[q.id] = { ok };
    }
    if (!ok) {
      allOk = false;
      if (q.core) coreOk = false;
    }
  }
  if (empty) return { empty: true };
  const missingDeductions = F.essentialDeductions.filter((d) => !p.deductions.includes(d));
  feedback.board = { ok: missingDeductions.length === 0, missing: missingDeductions.length };
  const outcome = !coreOk ? 'incomplete' : allOk && missingDeductions.length === 0 ? 'strong' : 'partial';
  return { outcome, feedback };
}
