import { describe, it, expect } from 'vitest';
import { caseById, CASES } from '../src/content/index.js';
import { act, newProgress, scoreOf, hintBalance, purchasedLevels, activeObjectives, locationStatus, unlockedLocations } from '../src/game/engine.js';
import { DEFAULT_CONFIG, mergeConfig } from '../src/game/config.js';
import { play } from './cases.test.js';

const A = caseById('broadcast');
const B = caseById('harvest');
const C = caseById('house');
const fresh = (def) => newProgress(def, 1, null, 0);
const step = (def, p, action, cfg) => act(def, p, action, cfg, 1000);

describe('interactions & locks', () => {
  it('refuses objects in another location', () => {
    const { r } = step(A, fresh(A), { type: 'interact', obj: 'po_report' });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('not_here');
  });

  it('gives locked feedback before prerequisites and opens afterwards', () => {
    let p = fresh(A);
    let res = step(A, p, { type: 'interact', obj: 'st_whiteboard' });
    expect(res.r.code).toBe('locked');
    expect(res.r.msg).toBeTruthy();
    ({ p } = play(A, [['interact', 'st_log'], ['visit', 'police'], ['interact', 'po_access'], ['visit', 'market'], ['interact', 'sm_receipt'], ['visit', 'station']], p));
    res = step(A, p, { type: 'interact', obj: 'st_whiteboard' });
    expect(res.r.ok).toBe(true);
    expect(res.r.open.puzzle).toBe('p_timeline');
  });

  it('cannot travel to a locked location', () => {
    const { r } = step(A, fresh(A), { type: 'visit', loc: 'tower' });
    expect(r.code).toBe('location_locked');
  });

  it('awards discovery rewards exactly once', () => {
    let p = fresh(A);
    p = step(A, p, { type: 'interact', obj: 'st_log' }).p;
    const s1 = scoreOf(A, p);
    const b1 = hintBalance(A, p);
    for (let i = 0; i < 5; i++) p = step(A, p, { type: 'interact', obj: 'st_log' }).p;
    expect(scoreOf(A, p)).toBe(s1);
    expect(hintBalance(A, p)).toBe(b1);
    expect(p.clues.filter((c) => c === 'log')).toHaveLength(1);
  });

  it('changes an object description after a related discovery', () => {
    const { p } = play(A, [['visit', 'police']]);
    const before = A.objects.find((o) => o.id === 'po_key');
    expect(before.show).toBeTruthy(); // hidden until the outage puzzle is solved
    expect(locationStatus(A, p, 'police').unlocked).toBe(true);
  });
});

describe('inventory', () => {
  it('rejects an incompatible item without consuming it', () => {
    let { p } = play(A, [['visit', 'newspaper'], ['interact', 'np_desk'], ['interact', 'np_editor'], ['visit', 'apartment'], ['interact', 'ap_cup']]);
    expect(p.items).toContain('key7');
    const res = step(A, p, { type: 'use', item: 'key7', obj: 'ap_wardrobe' });
    expect(res.r.code).toBe('incompatible');
    expect(res.p.used).not.toContain('key7');
  });

  it('cannot use an item the player does not have', () => {
    const { r } = step(A, fresh(A), { type: 'use', item: 'key7', obj: 'st_console' });
    expect(r.code).toBe('no_item');
  });
});

describe('puzzles', () => {
  const ready = () =>
    play(A, [['interact', 'st_log'], ['visit', 'police'], ['interact', 'po_access'], ['interact', 'po_report'], ['visit', 'market'], ['interact', 'sm_receipt'], ['interact', 'sm_freezer'], ['visit', 'station']]).p;

  it('rejects empty answers without counting an attempt', () => {
    const { p, r } = step(A, ready(), { type: 'solve', puzzle: 'p_outage', answer: '' });
    expect(r.code).toBe('empty');
    expect(p.attempts.p_outage).toBeUndefined();
  });

  it('keeps progress after a wrong answer and explains it', () => {
    const p0 = ready();
    const { p, r } = step(A, p0, { type: 'solve', puzzle: 'p_outage', answer: 'hale' });
    expect(r.code).toBe('wrong');
    expect(r.msg).toBeTruthy();
    expect(p.clues).toEqual(p0.clues);
    expect(p.solved).not.toContain('p_outage');
  });

  it('reports partial correctness for an ordering', () => {
    const { r } = step(A, ready(), { type: 'solve', puzzle: 'p_timeline', answer: ['cut', 'hale_in', 'mira_in', 'back', 'mira_out', 'shop'] });
    expect(r.code).toBe('wrong');
    expect(r.detail).toEqual({ correct: 4, total: 6 });
  });

  it('does not award a puzzle twice', () => {
    let p = step(A, ready(), { type: 'solve', puzzle: 'p_outage', answer: 'freezer' }).p;
    const s = scoreOf(A, p);
    const res = step(A, p, { type: 'solve', puzzle: 'p_outage', answer: 'freezer' });
    expect(res.r.code).toBe('already_solved');
    expect(scoreOf(A, res.p)).toBe(s);
  });

  it('accepts the word answer in every language, ignoring prefixes and accents', () => {
    let { p } = play(C, [
      ['interact', 'ar_map55'], ['interact', 'ar_map70'], ['interact', 'ar_registry'], ['interact', 'ar_decree'], ['solve', 'c_maps', '13_17'],
      ['visit', 'newspaper'], ['interact', 'np_photo'], ['visit', 'street'], ['interact', 'st_vane'],
      ['solve', 'c_photo', { vane: 'hedge', window: 'nothing', lane: 'linden' }], ['visit', 'garden'], ['interact', 'gd_door'],
    ]);
    for (const answer of ['الدرّازة', 'درب الدرازة', 'زقاق النسّاجين', 'النساجين', 'Rue des Tisserands', 'tisserands', 'Weavers’ Lane', 'WEAVERS']) {
      expect(step(C, p, { type: 'solve', puzzle: 'c_word', answer }).r.code).toBe('ok');
    }
    expect(step(C, p, { type: 'solve', puzzle: 'c_word', answer: 'Linden' }).r.code).toBe('wrong');
  });
});

describe('hint economy', () => {
  const base = () => play(A, [['interact', 'st_log'], ['visit', 'police'], ['interact', 'po_access'], ['visit', 'market'], ['interact', 'sm_receipt']]).p;

  it('refuses hints for puzzles the player has not reached', () => {
    expect(step(A, fresh(A), { type: 'hint', puzzle: 'p_code', level: 1, tx: 't1' }).r.code).toBe('hint_unavailable');
  });

  it('charges the exact configured cost once, even on repeat or duplicate transactions', () => {
    const p0 = base();
    const bal = hintBalance(A, p0);
    let { p, r } = step(A, p0, { type: 'hint', puzzle: 'p_timeline', level: 1, tx: 'tx-1' });
    expect(r.code).toBe('purchased');
    expect(hintBalance(A, p)).toBe(bal - DEFAULT_CONFIG.hints.costs[0]);
    const again = step(A, p, { type: 'hint', puzzle: 'p_timeline', level: 1, tx: 'tx-2' });
    expect(again.r.code).toBe('already_purchased');
    expect(hintBalance(A, again.p)).toBe(bal - DEFAULT_CONFIG.hints.costs[0]);
    const dup = step(A, p, { type: 'hint', puzzle: 'p_timeline', level: 2, tx: 'tx-1' });
    expect(dup.r.code).toBe('duplicate_tx');
  });

  it('requires levels in order and keeps all purchased levels', () => {
    let p = base();
    expect(step(A, p, { type: 'hint', puzzle: 'p_timeline', level: 2, tx: 'a' }).r.code).toBe('previous_level_first');
    p = step(A, p, { type: 'hint', puzzle: 'p_timeline', level: 1, tx: 'a' }).p;
    p = step(A, p, { type: 'hint', puzzle: 'p_timeline', level: 2, tx: 'b' }).p;
    expect(purchasedLevels(p, 'p_timeline')).toEqual([1, 2]);
  });

  it('never lets the balance go negative', () => {
    const cfg = mergeConfig({ hintCosts: [50, 60, 70], startBalance: 0 });
    const p0 = base();
    const bal = hintBalance(A, p0, cfg);
    expect(bal).toBeLessThan(50);
    const { p, r } = step(A, p0, { type: 'hint', puzzle: 'p_timeline', level: 1, tx: 'x' }, cfg);
    expect(r.code).toBe('insufficient');
    expect(p.hints).toHaveLength(0);
    expect(hintBalance(A, p, cfg)).toBe(bal);
  });

  it('keeps hint spending separate from the score', () => {
    const p0 = base();
    const p = step(A, p0, { type: 'hint', puzzle: 'p_timeline', level: 1, tx: 'z' }).p;
    expect(scoreOf(A, p)).toBe(scoreOf(A, p0));
  });
});

describe('deductions, objectives, final', () => {
  it('rejects unrelated connections without awarding anything', () => {
    let { p } = play(A, [['interact', 'st_log'], ['interact', 'st_tape']]);
    const s = scoreOf(A, p);
    const res = step(A, p, { type: 'connect', a: 'log', b: 'tape' });
    expect(res.r.code).toBe('no_link');
    expect(scoreOf(A, res.p)).toBe(s);
  });

  it('cannot connect clues the player has not found', () => {
    expect(step(A, fresh(A), { type: 'connect', a: 'log', b: 'breaker' }).r.code).toBe('invalid_pair');
  });

  it('shows objectives driven by state, with several open paths at once', () => {
    let { p } = play(A, [['interact', 'st_log'], ['visit', 'police'], ['interact', 'po_report']]);
    const ids = activeObjectives(A, p).map((o) => o.id);
    expect(ids).toContain('o_times');
    expect(ids).toContain('o_outage');
  });

  it('refuses the final before the evidence exists', () => {
    expect(step(A, fresh(A), { type: 'final', answers: { q_what: 'manual' } }).r.code).toBe('locked');
  });

  it('grades a wrong core answer as incomplete and allows another attempt', () => {
    const steps = A.walkthrough.slice(0, -1);
    const { p } = play(A, steps);
    const bad = step(A, p, { type: 'final', answers: { q_what: 'grid', q_who: 'hale' } });
    expect(bad.r.code).toBe('incomplete');
    expect(bad.p.completed).toBe(false);
    expect(bad.p.claimed.some((c) => c.startsWith('complete:'))).toBe(false);
  });

  it('grades a correct conclusion without the board connections as partial', () => {
    const steps = A.walkthrough.filter(([t]) => t !== 'connect');
    const { p } = play(A, steps);
    expect(p.outcome).toBe('partial');
  });

  it('ignores evidence the player never found, and penalises rumours', () => {
    const steps = B.walkthrough.slice(0, -1);
    const { p } = play(B, steps);
    const answers = { ...B.walkthrough.at(-1)[1], q_evidence: [...B.walkthrough.at(-1)[1].q_evidence, 'rumor_spirit'] };
    const res = step(B, p, { type: 'final', answers });
    expect(res.r.grade.feedback.q_evidence.weak).toBe(1);
    expect(res.p.outcome).toBe('partial');
  });
});

describe('case isolation', () => {
  it('rejects actions applied to the wrong case', () => {
    expect(act(B, fresh(A), { type: 'visit', loc: 'square' }).r.code).toBe('wrong_case');
  });

  it('keeps ids and progress separate between cases', () => {
    const a = play(A, A.walkthrough).p;
    const b = fresh(B);
    expect(b.solved).toHaveLength(0);
    expect(unlockedLocations(B, b)).not.toContain('garden');
    expect(a.caseId).toBe('broadcast');
  });

  it('has unique object ids across all cases', () => {
    for (const def of CASES) {
      const ids = def.objects.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
