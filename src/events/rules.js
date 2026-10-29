// Event rules shared by the client and the development simulation.
// The Supabase functions in supabase/migrations/001_noctaviae.sql enforce the same rules server-side.
import { EVENT_LIMITS } from '../game/config.js';
import { CASES } from '../content/index.js';

export const STATUSES = ['draft', 'scheduled', 'open', 'active', 'paused', 'completed', 'cancelled'];

export const TRANSITIONS = {
  draft: ['scheduled', 'open', 'cancelled'],
  scheduled: ['open', 'cancelled'],
  open: ['active', 'paused', 'cancelled'],
  active: ['paused', 'completed', 'cancelled'],
  paused: ['active', 'completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
export const canTransition = (from, to) => (TRANSITIONS[from] ?? []).includes(to);
export const joinable = (status) => status === 'open' || status === 'active';
export const playable = (status) => status === 'active';

/** Same ordering as noct_leaderboard: score ↓, cases ↓, time score was reached ↑, join time ↑, id ↑. */
export function rankRows(rows) {
  const sorted = [...rows].sort(
    (a, b) =>
      b.score - a.score ||
      b.cases_completed - a.cases_completed ||
      String(a.reached_at).localeCompare(String(b.reached_at)) ||
      String(a.joined_at).localeCompare(String(b.joined_at)) ||
      String(a.id).localeCompare(String(b.id)),
  );
  let rank = 0;
  return sorted.map((r, i) => {
    const prev = sorted[i - 1];
    if (!prev || prev.score !== r.score || prev.cases_completed !== r.cases_completed) rank = i + 1;
    return { ...r, rank };
  });
}

const NAME_RE = /^[\p{L}\p{N} _.\-]{2,24}$/u;
export const cleanName = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
export const validName = (s) => NAME_RE.test(cleanName(s));
export const cleanCode = (s) => String(s ?? '').trim().toUpperCase();
export const validCode = (s) => /^[A-Z0-9]{6,12}$/.test(cleanCode(s));

/** Client-side pre-check of admin input. The server validates again. */
export function validateEventInput(e) {
  const errs = [];
  if (!e.name || e.name.length > 80) errs.push('name');
  if ((e.description ?? '').length > 500) errs.push('description');
  if (e.access_code && !validCode(e.access_code)) errs.push('access_code');
  const ids = CASES.map((c) => c.id);
  if (!Array.isArray(e.allowed_cases) || !e.allowed_cases.length || e.allowed_cases.some((c) => !ids.includes(c))) errs.push('allowed_cases');
  if (!Array.isArray(e.hint_costs) || e.hint_costs.length !== 3 || e.hint_costs.some((c) => !Number.isInteger(c) || c < EVENT_LIMITS.hintCost.min || c > EVENT_LIMITS.hintCost.max)) errs.push('hint_costs');
  if (!Number.isInteger(e.start_balance) || e.start_balance < EVENT_LIMITS.startBalance.min || e.start_balance > EVENT_LIMITS.startBalance.max) errs.push('start_balance');
  if (!Number.isInteger(e.max_participants) || e.max_participants < 1 || e.max_participants > 1000) errs.push('max_participants');
  if (e.starts_at && e.ends_at && new Date(e.ends_at) <= new Date(e.starts_at)) errs.push('ends_at');
  return errs;
}

/** CSV cell escaping, including protection against spreadsheet formula injection. */
export function csvCell(v) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const EXPORT_COLUMNS = ['rank', 'display_name', 'score', 'cases_completed'];

export function toCSV(rows, columns = EXPORT_COLUMNS) {
  const lines = [columns.join(',')];
  for (const r of rows) lines.push(columns.map((c) => csvCell(r[c])).join(','));
  return '﻿' + lines.join('\r\n');
}

/** Map a server/network error to a stable code the UI can translate. */
export function errorCode(err) {
  const msg = String(err?.code ?? err?.message ?? err ?? '');
  const known = ['not_authenticated', 'not_authorized', 'not_member', 'event_paused', 'event_not_active', 'event_ended', 'rate_limited', 'case_not_allowed'];
  return known.find((k) => msg.includes(k)) ?? (/fetch|network|Failed to|timeout/i.test(msg) ? 'network' : 'server_error');
}
export const retryable = (code) => code === 'network' || code === 'rate_limited' || code === 'server_error';
