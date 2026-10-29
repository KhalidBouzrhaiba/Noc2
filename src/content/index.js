import broadcast from './broadcast.js';
import harvest from './harvest.js';
import house from './house.js';
import { refsOf } from '../game/conditions.js';

function prepare(def) {
  for (const [id, c] of Object.entries(def.clues)) c.id = id;
  for (const [id, it] of Object.entries(def.items)) it.id = id;
  for (const [id, pz] of Object.entries(def.puzzles)) pz.id = id;
  def.final.id = 'final';
  return Object.freeze(def);
}

export const CASES = [prepare(broadcast), prepare(harvest), prepare(house)];
export const caseById = (id) => CASES.find((c) => c.id === id) ?? null;

/** Structural validation of a case definition. Returns a list of problems (empty = valid). */
export function validateCase(def) {
  const errs = [];
  const locs = new Set(def.locations.map((l) => l.id));
  const objs = new Set(def.objects.map((o) => o.id));
  const deds = new Set(def.deductions.map((d) => d.id));
  const need = (ok, msg) => ok || errs.push(msg);
  const checkCond = (cond, where) => {
    for (const [k, v] of refsOf(cond)) {
      if (k === 'clue') need(!!def.clues[v], `${where}: unknown clue ${v}`);
      else if (k === 'item' || k === 'holding' || k === 'used') need(!!def.items[v], `${where}: unknown item ${v}`);
      else if (k === 'puzzle') need(!!def.puzzles[v], `${where}: unknown puzzle ${v}`);
      else if (k === 'deduction') need(deds.has(v), `${where}: unknown deduction ${v}`);
      else if (k === 'visited') need(locs.has(v), `${where}: unknown location ${v}`);
      else if (k === 'seen') need(objs.has(v), `${where}: unknown object ${v}`);
    }
  };
  const checkGives = (g, where) => {
    for (const c of g?.clues ?? []) need(!!def.clues[c], `${where}: gives unknown clue ${c}`);
    for (const i of g?.items ?? []) need(!!def.items[i], `${where}: gives unknown item ${i}`);
  };
  need(locs.has(def.start), 'start location missing');
  for (const l of def.locations) checkCond(l.unlock, `location ${l.id}`);
  const obtainable = new Set();
  const obtainableItems = new Set();
  const note = (g) => {
    (g?.clues ?? []).forEach((c) => obtainable.add(c));
    (g?.items ?? []).forEach((i) => obtainableItems.add(i));
  };
  for (const o of def.objects) {
    need(locs.has(o.loc), `object ${o.id}: unknown location ${o.loc}`);
    need(Array.isArray(o.at) && o.at.length === 3, `object ${o.id}: missing position`);
    checkCond(o.show, `object ${o.id}.show`);
    checkCond(o.requires, `object ${o.id}.requires`);
    checkGives(o.gives, `object ${o.id}`);
    note(o.gives);
    if (o.doc) need(!!def.clues[o.doc], `object ${o.id}: unknown doc ${o.doc}`);
    if (o.puzzle) need(!!def.puzzles[o.puzzle], `object ${o.id}: unknown puzzle ${o.puzzle}`);
    if (o.requires) need(!!o.locked, `object ${o.id}: requires without locked feedback`);
    if (o.puzzle && def.puzzles[o.puzzle]?.requires) need(!!o.locked, `object ${o.id}: puzzle without locked feedback`);
    if (Array.isArray(o.text)) o.text.forEach((s, i) => checkCond(s.if, `object ${o.id}.text[${i}]`));
    for (const a of o.accepts ?? []) {
      need(!!def.items[a.item], `object ${o.id}: accepts unknown item ${a.item}`);
      checkGives(a.gives, `object ${o.id}.accepts`);
      note(a.gives);
    }
  }
  for (const pz of Object.values(def.puzzles)) {
    checkCond(pz.requires, `puzzle ${pz.id}`);
    checkGives(pz.gives, `puzzle ${pz.id}`);
    note(pz.gives);
    need(Array.isArray(pz.hints) && pz.hints.length === 3, `puzzle ${pz.id}: needs 3 hints`);
    need(def.objects.some((o) => o.puzzle === pz.id), `puzzle ${pz.id}: no object opens it`);
    if (pz.type === 'choice') need(pz.options.some((o) => o.id === pz.answer), `puzzle ${pz.id}: answer not an option`);
    if (pz.type === 'order') {
      need(pz.answer.every((x) => pz.items[x]), `puzzle ${pz.id}: order answer item missing`);
      need(pz.shuffled.join() !== pz.answer.join(), `puzzle ${pz.id}: starts solved`);
    }
  }
  for (const d of def.deductions) {
    d.pair.forEach((c) => need(!!def.clues[c], `deduction ${d.id}: unknown clue ${c}`));
    note(d.gives);
  }
  for (const c of def.contradictions ?? []) {
    c.pair.forEach((x) => need(!!def.clues[x], `contradiction ${c.id}: unknown clue ${x}`));
    need(deds.has(c.resolvedBy), `contradiction ${c.id}: unknown deduction`);
  }
  for (const o of def.objectives) {
    checkCond(o.when, `objective ${o.id}.when`);
    checkCond(o.done, `objective ${o.id}.done`);
  }
  checkCond(def.final.requires, 'final.requires');
  def.final.essentialDeductions.forEach((d) => need(deds.has(d), `final: unknown deduction ${d}`));
  for (const q of def.final.questions) {
    if (q.type === 'evidence') q.required.forEach((c) => need(!!def.clues[c], `final ${q.id}: unknown clue ${c}`));
    if (q.type === 'choice') need(q.options.some((o) => o.id === q.answer), `final ${q.id}: answer not an option`);
  }
  need(def.final.hints?.length === 3, 'final: needs 3 hints');
  for (const c of Object.keys(def.clues)) need(obtainable.has(c), `clue ${c} can never be obtained`);
  for (const i of Object.keys(def.items)) need(obtainableItems.has(i), `item ${i} can never be obtained`);
  for (const f of def.facts ?? []) need(!!def.clues[f.clue], `fact: unknown clue ${f.clue}`);
  return errs;
}
