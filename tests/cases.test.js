import { describe, it, expect } from 'vitest';
import { CASES, validateCase } from '../src/content/index.js';
import { act, newProgress, scoreOf, hintBalance } from '../src/game/engine.js';

export function play(def, steps, p = newProgress(def, 1, null, 0)) {
  const log = [];
  for (const [type, a, b] of steps) {
    let action;
    if (type === 'visit') action = { type, loc: a };
    else if (type === 'interact') action = { type, obj: a };
    else if (type === 'use') action = { type, item: a, obj: b };
    else if (type === 'solve') action = { type, puzzle: a, answer: b };
    else if (type === 'connect') action = { type, a, b };
    else if (type === 'final') action = { type, answers: a };
    // puzzles/visits happen where the player stands; walk to the right place for "use"/"interact"
    const res = act(def, p, action, undefined, 1000);
    log.push([type, a, res.r.code]);
    if (!res.r.ok) throw new Error(`${def.id}: step ${type} ${JSON.stringify(a)} failed: ${res.r.code}`);
    p = res.p;
  }
  return { p, log };
}

describe.each(CASES.map((c) => [c.id, c]))('case %s', (_id, def) => {
  it('has a structurally valid definition', () => {
    expect(validateCase(def)).toEqual([]);
  });

  it('can be completed with a strong conclusion via the scripted walkthrough', () => {
    const { p } = play(def, def.walkthrough);
    expect(p.completed).toBe(true);
    expect(p.outcome).toBe('strong');
    expect(scoreOf(def, p)).toBeGreaterThan(0);
    expect(hintBalance(def, p)).toBeGreaterThanOrEqual(0);
    // every non-optional clue is reachable in the walkthrough
    for (const [id, c] of Object.entries(def.clues)) if (!c.optional) expect(p.clues).toContain(id);
  });
});
