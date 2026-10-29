// Tunable game economy. Change values here; no game logic hard-codes these numbers.
// Events (Part 4) may override `hints.costs` and `hints.startBalance` within EVENT_LIMITS.

export const DEFAULT_CONFIG = Object.freeze({
  hints: {
    costs: [20, 35, 50], // level 1 nudge, level 2 relationship, level 3 strong guidance
    startBalance: 40,
  },
  // `score` adds to the case score; `hint` adds spendable hint points.
  rewards: {
    visit: { score: 10, hint: 5 }, // first visit to a location
    clue: { score: 15, hint: 5 }, // a new piece of core evidence
    item: { score: 5, hint: 0 }, // a new inventory item
    optional: { score: 20, hint: 10 }, // optional material
    puzzle: { score: 50, hint: 15 }, // first solve of a puzzle
    deduction: { score: 30, hint: 10 }, // a valid evidence connection
  },
  completion: { strong: 300, partial: 120, incomplete: 0 },
});

// Bounds an organizer may choose for an event (validated server-side too).
export const EVENT_LIMITS = Object.freeze({
  hintCost: { min: 0, max: 200 },
  startBalance: { min: 0, max: 500 },
});

export function mergeConfig(overrides) {
  if (!overrides) return DEFAULT_CONFIG;
  const costs = Array.isArray(overrides.hintCosts) && overrides.hintCosts.length === 3
    ? overrides.hintCosts.map((c) => clamp(c, EVENT_LIMITS.hintCost))
    : DEFAULT_CONFIG.hints.costs;
  const startBalance = overrides.startBalance != null
    ? clamp(overrides.startBalance, EVENT_LIMITS.startBalance)
    : DEFAULT_CONFIG.hints.startBalance;
  return { ...DEFAULT_CONFIG, hints: { costs, startBalance } };
}

function clamp(v, { min, max }) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}
