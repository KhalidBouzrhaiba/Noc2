import { describe, it, expect } from 'vitest';
import { canTransition, rankRows, toCSV, csvCell, validName, validateEventInput, errorCode, retryable, TRANSITIONS } from '../src/events/rules.js';
import { allCanon } from '../src/events/canon.js';
import { CASES } from '../src/content/index.js';
import { buildCanonSql } from '../src/events/canonSql.js';
import { readFileSync } from 'node:fs';

describe('event rules', () => {
  it('allows only defined lifecycle transitions', () => {
    expect(canTransition('draft', 'open')).toBe(true);
    expect(canTransition('active', 'paused')).toBe(true);
    expect(canTransition('completed', 'active')).toBe(false);
    expect(canTransition('cancelled', 'open')).toBe(false);
    expect(canTransition('draft', 'completed')).toBe(false);
    expect(Object.keys(TRANSITIONS)).toHaveLength(7);
  });

  it('ranks with a deterministic tie-break and shared ranks for equal results', () => {
    const rows = [
      { id: 'c', display_name: 'C', score: 100, cases_completed: 1, reached_at: '2026-10-31T20:05', joined_at: '2026-10-31T19:00' },
      { id: 'a', display_name: 'A', score: 100, cases_completed: 1, reached_at: '2026-10-31T20:01', joined_at: '2026-10-31T19:10' },
      { id: 'b', display_name: 'B', score: 140, cases_completed: 0, reached_at: '2026-10-31T21:00', joined_at: '2026-10-31T19:20' },
      { id: 'd', display_name: 'D', score: 0, cases_completed: 0, reached_at: null, joined_at: '2026-10-31T19:30' },
    ];
    const ranked = rankRows(rows);
    expect(ranked.map((r) => r.display_name)).toEqual(['B', 'A', 'C', 'D']);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 2, 4]);
    expect(rankRows([...rows].reverse()).map((r) => r.display_name)).toEqual(['B', 'A', 'C', 'D']);
  });

  it('exports CSV safely', () => {
    expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
    expect(csvCell('+1')).toBe("'+1");
    expect(csvCell('a,b')).toBe('"a,b"');
    const csv = toCSV([{ rank: 1, display_name: 'أمل', score: 10, cases_completed: 1, user_id: 'secret' }]);
    expect(csv).toContain('rank,display_name,score,cases_completed');
    expect(csv).toContain('أمل');
    expect(csv).not.toContain('secret');
  });

  it('validates names and event settings', () => {
    expect(validName('Amal')).toBe(true);
    expect(validName('أمل ب')).toBe(true);
    expect(validName('<script>')).toBe(false);
    expect(validName('a')).toBe(false);
    const ok = { name: 'Night', allowed_cases: ['broadcast'], hint_costs: [20, 35, 50], start_balance: 40, max_participants: 50 };
    expect(validateEventInput(ok)).toEqual([]);
    expect(validateEventInput({ ...ok, hint_costs: [20, 35, 900] })).toContain('hint_costs');
    expect(validateEventInput({ ...ok, allowed_cases: ['nope'] })).toContain('allowed_cases');
  });

  it('classifies errors for retries', () => {
    expect(errorCode(new Error('TypeError: Failed to fetch'))).toBe('network');
    expect(errorCode({ message: 'event_paused' })).toBe('event_paused');
    expect(retryable('network')).toBe(true);
    expect(retryable('not_member')).toBe(false);
  });

  it('keeps the generated server rules in sync with the game content (run npm run gen:canon)', () => {
    expect(readFileSync(new URL('../supabase/migrations/002_canon.sql', import.meta.url), 'utf8')).toBe(buildCanonSql());
  });

  it('derives canonical rules for every reward the game can award', () => {
    const canon = allCanon();
    expect(canon.map((c) => c.case_id)).toEqual(CASES.map((c) => c.id));
    for (const def of CASES) {
      const c = canon.find((x) => x.case_id === def.id);
      for (const clue of Object.keys(def.clues)) expect(c.rewards.some((r) => r.reward_id === `clue:${clue}`)).toBe(true);
      for (const pz of Object.keys(def.puzzles)) expect(c.puzzles.some((p) => p.puzzle_id === pz)).toBe(true);
    }
  });
});
