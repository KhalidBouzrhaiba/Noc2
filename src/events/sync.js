// Mirrors local game results to the event server through a persisted outbox.
// Each operation carries a transaction id, so retries after a refresh or a lost
// connection never count twice. Operations are sent in order (claims depend on earlier ones).
import { errorCode } from './rules.js';

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

/** Translate one engine result into server operations. */
export function opsFromResult(caseId, action, r) {
  const ops = [];
  for (const reward of r?.gained?.rewards ?? []) {
    if (reward.startsWith('puzzle:')) ops.push({ kind: 'solve', caseId, puzzle: reward.slice(7), answer: action.answer });
    else if (reward.startsWith('complete:')) ops.push({ kind: 'complete', caseId, answers: action.answers });
    else ops.push({ kind: 'claim', caseId, reward });
  }
  for (const f of r?.gained?.flags ?? []) ops.push({ kind: 'claim', caseId, reward: `flag:${f}` });
  return ops;
}

export function createSync(api, eventId, onChange) {
  const KEY = `noctaviae:event:${eventId}:outbox`;
  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    queue = [];
  }
  const state = { pending: queue.length, rejected: [], error: null, score: null, flushing: false };
  let timer = null;
  let backoff = 2000;
  let stopped = false;

  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(queue));
    } catch {
      /* the server state remains authoritative */
    }
  };
  const emit = () => {
    state.pending = queue.length;
    onChange?.({ ...state });
  };

  async function send(op) {
    if (op.kind === 'claim') return api.claim(eventId, op.caseId, op.reward, op.tx);
    if (op.kind === 'solve') return api.solve(eventId, op.caseId, op.puzzle, op.answer, op.tx);
    if (op.kind === 'complete') return api.complete(eventId, op.caseId, op.answers, op.tx);
    return { ok: false, code: 'unknown_op' };
  }

  async function flush() {
    if (state.flushing || stopped) return;
    state.flushing = true;
    emit();
    while (queue.length && !stopped) {
      const op = queue[0];
      try {
        const res = await send(op);
        if (res && res.score != null) state.score = res.score;
        if (res && !res.ok) state.rejected = [...state.rejected.slice(-9), { op: op.reward ?? op.puzzle ?? op.kind, code: res.code }];
        queue.shift();
        persist();
        state.error = null;
        backoff = 2000;
      } catch (e) {
        const code = errorCode(e);
        state.error = code;
        if (code === 'network' || code === 'rate_limited' || code === 'server_error' || code === 'event_paused') {
          clearTimeout(timer);
          timer = setTimeout(flush, code === 'event_paused' ? 30000 : backoff);
          backoff = Math.min(backoff * 2, 60000);
          break;
        }
        // permanent refusal (not a member, event closed…): drop it and tell the player
        state.rejected = [...state.rejected.slice(-9), { op: op.reward ?? op.puzzle ?? op.kind, code }];
        queue.shift();
        persist();
      }
    }
    state.flushing = false;
    emit();
  }

  return {
    enqueue(ops) {
      if (!ops.length) return;
      for (const op of ops) queue.push({ ...op, tx: uuid() });
      persist();
      emit();
      flush();
    },
    flush,
    state: () => ({ ...state, pending: queue.length }),
    stop() {
      stopped = true;
      clearTimeout(timer);
    },
  };
}
