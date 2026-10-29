// A tiny condition language used by case content:
//   { clue: 'id' } { item: 'id' } { holding: 'id' } { used: 'id' } { puzzle: 'id' } { flag: 'id' }
//   { deduction: 'id' } { visited: 'loc' } { seen: 'objId' } { all: [...] } { any: [...] } { not: cond }
// `undefined`/`null` means "always true".

export function check(cond, p) {
  if (!cond) return true;
  if (cond.all) return cond.all.every((c) => check(c, p));
  if (cond.any) return cond.any.some((c) => check(c, p));
  if (cond.not) return !check(cond.not, p);
  if (cond.clue) return p.clues.includes(cond.clue);
  if (cond.item) return p.items.includes(cond.item);
  if (cond.holding) return p.items.includes(cond.holding) && !p.used.includes(cond.holding);
  if (cond.used) return p.used.includes(cond.used);
  if (cond.puzzle) return p.solved.includes(cond.puzzle);
  if (cond.flag) return p.flags.includes(cond.flag);
  if (cond.deduction) return p.deductions.includes(cond.deduction);
  if (cond.visited) return p.visited.includes(cond.visited);
  if (cond.seen) return p.seen[cond.seen] != null;
  throw new Error(`Unknown condition ${JSON.stringify(cond)}`);
}

/** Collect every id referenced by a condition, for content validation. */
export function refsOf(cond, out = []) {
  if (!cond) return out;
  if (cond.all || cond.any) (cond.all || cond.any).forEach((c) => refsOf(c, out));
  else if (cond.not) refsOf(cond.not, out);
  else {
    const [k, v] = Object.entries(cond)[0];
    out.push([k, v]);
  }
  return out;
}
