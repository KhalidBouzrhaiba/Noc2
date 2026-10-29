// Canonical, server-checkable rules derived from the case content. Used to generate the
// Supabase seed (scripts/gen-canon-sql.mjs) and by the development simulation, so both
// validate claims with exactly the same prerequisites as the game engine.
import { CASES } from '../content/index.js';
import { DEFAULT_CONFIG } from '../game/config.js';
import { rewardValue } from '../game/engine.js';

const all = (...conds) => {
  const xs = conds.filter(Boolean);
  if (!xs.length) return null;
  return xs.length === 1 ? xs[0] : { all: xs };
};

export function buildCanon(def, cfg = DEFAULT_CONFIG) {
  const sources = new Map(); // rewardId -> [conditions]
  const add = (id, cond) => {
    if (!sources.has(id)) sources.set(id, []);
    sources.get(id).push(cond ?? null);
  };
  const locUnlock = (id) => def.locations.find((l) => l.id === id)?.unlock ?? null;

  for (const l of def.locations) add(`visit:${l.id}`, l.unlock ?? null);
  for (const o of def.objects) {
    const base = all(locUnlock(o.loc), o.show, o.requires);
    for (const c of o.gives?.clues ?? []) add(`clue:${c}`, base);
    for (const i of o.gives?.items ?? []) add(`item:${i}`, base);
    for (const f of o.gives?.flags ?? []) add(`flag:${f}`, base);
    for (const u of o.accepts ?? []) {
      const cond = all(locUnlock(o.loc), o.show, u.requires, { item: u.item });
      for (const c of u.gives?.clues ?? []) add(`clue:${c}`, cond);
      for (const i of u.gives?.items ?? []) add(`item:${i}`, cond);
      if (u.flag) add(`flag:${u.flag}`, cond);
    }
  }
  for (const pz of Object.values(def.puzzles)) {
    for (const c of pz.gives?.clues ?? []) add(`clue:${c}`, { puzzle: pz.id });
    for (const i of pz.gives?.items ?? []) add(`item:${i}`, { puzzle: pz.id });
  }
  for (const d of def.deductions) add(`deduction:${d.id}`, { all: d.pair.map((c) => ({ clue: c })) });

  const rewards = [...sources.entries()].map(([id, conds]) => {
    const requires = conds.some((c) => c === null) ? null : conds.length === 1 ? conds[0] : { any: conds };
    const v = id.startsWith('flag:') ? { score: 0, hint: 0 } : rewardValue(def, id, cfg);
    return { reward_id: id, score: v.score, hint: v.hint, requires };
  });

  const puzzles = Object.values(def.puzzles).map((pz) => ({
    puzzle_id: pz.id,
    type: pz.type,
    answer: pz.type === 'word' ? Object.values(pz.answers).flat() : pz.answer,
    filler: pz.filler ?? [],
    requires: pz.requires ?? null,
    score: rewardValue(def, `puzzle:${pz.id}`, cfg).score,
    hint: rewardValue(def, `puzzle:${pz.id}`, cfg).hint,
  }));

  const final = {
    requires: def.final.requires ?? null,
    questions: def.final.questions.map((q) =>
      q.type === 'evidence' ? { id: q.id, type: q.type, required: q.required, core: !!q.core } : { id: q.id, type: q.type, answer: q.answer, core: !!q.core },
    ),
    essential: def.final.essentialDeductions,
    rumor_clues: Object.values(def.clues).filter((c) => c.status === 'rumor').map((c) => c.id),
    completion: { strong: cfg.completion.strong, partial: cfg.completion.partial },
  };
  return { case_id: def.id, rewards, puzzles, final };
}

export const allCanon = () => CASES.map((d) => buildCanon(d));
