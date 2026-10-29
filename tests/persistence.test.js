import { describe, it, expect } from 'vitest';
import { caseById } from '../src/content/index.js';
import { newProgress } from '../src/game/engine.js';
import { createStore, validateProgress, loadCase, saveCase, deleteCase, KEYS } from '../src/game/persistence.js';
import { play } from './cases.test.js';

const A = caseById('broadcast');
const B = caseById('harvest');

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    dump: m,
  };
}

describe('save/resume', () => {
  it('round-trips a partially completed case exactly', () => {
    const store = createStore(memoryStorage());
    const { p } = play(A, A.walkthrough.slice(0, 20));
    expect(saveCase(store, p).ok).toBe(true);
    const res = loadCase(store, A);
    expect(res.status).toBe('ok');
    expect(res.p).toEqual(p);
  });

  it('keeps separate records per case and deletes only one', () => {
    const store = createStore(memoryStorage());
    saveCase(store, play(A, A.walkthrough.slice(0, 5)).p);
    saveCase(store, play(B, B.walkthrough.slice(0, 5)).p);
    deleteCase(store, 'broadcast');
    expect(loadCase(store, A).status).toBe('empty');
    expect(loadCase(store, B).status).toBe('ok');
  });

  it('reports malformed JSON as invalid instead of crashing', () => {
    const s = memoryStorage();
    s.setItem(KEYS.case('broadcast'), '{not json');
    expect(loadCase(createStore(s), A).status).toBe('invalid');
  });

  it('rejects saves from a newer version or another case', () => {
    expect(validateProgress(A, { ...newProgress(A), v: 99 }).status).toBe('invalid');
    expect(validateProgress(A, newProgress(B)).status).toBe('invalid');
    expect(validateProgress(A, { caseId: 'broadcast' }).status).toBe('invalid');
  });

  it('repairs partially corrupted records without inventing progress', () => {
    const { p } = play(A, A.walkthrough.slice(0, 10));
    const broken = {
      ...p,
      clues: [...p.clues, 'not_a_clue', 42],
      items: 'nope',
      loc: 'mroom', // locked at this point
      hints: [{ puzzle: 'p_timeline', level: 1, cost: 20 }, { puzzle: 'p_timeline', level: 1, cost: 20 }, { puzzle: 'ghost', level: 1, cost: 1 }],
      completed: true,
      outcome: 'strong',
      claimed: [...p.claimed, '<script>'],
    };
    const res = validateProgress(A, broken);
    expect(res.status).toBe('repaired');
    expect(res.p.clues).toEqual(p.clues);
    expect(res.p.items).toEqual([]);
    expect(res.p.loc).toBe(A.start);
    expect(res.p.hints).toHaveLength(1);
    expect(res.p.claimed).toEqual(p.claimed);
    // a completion flag without its recorded completion claim is not trusted
    expect(res.p.completed).toBe(false);
    expect(res.problems).toContain('completion_invalid');
  });

  it('works when storage is unavailable', () => {
    const store = createStore(null);
    expect(saveCase(store, newProgress(A)).ok).toBe(false);
  });
});
