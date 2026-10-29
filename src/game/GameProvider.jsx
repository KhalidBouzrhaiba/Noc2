import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CASES, caseById } from '../content/index.js';
import { act, newProgress } from './engine.js';
import { DEFAULT_CONFIG } from './config.js';
import { createStore, loadCase, saveCase, KEYS } from './persistence.js';

const GameCtx = createContext(null);
const store = createStore();

/**
 * Holds every case's progress for the current scope ("solo", or "event:<id>" in Part 4).
 * Actions run through the pure engine synchronously against a ref, so two clicks in the same
 * frame see each other's result (no double purchases or double rewards).
 */
export function GameProvider({ children }) {
  const [scope, setScope] = useState('solo');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const progressRef = useRef({});
  const [progress, setProgress] = useState(() => loadAll('solo', progressRef));
  const [saveError, setSaveError] = useState(null);
  const listeners = useRef(new Set());

  const persist = useCallback(
    (p) => {
      const res = saveCase(store, p, scope);
      setSaveError(res.ok ? null : res.error);
      return res;
    },
    [scope],
  );

  const commit = useCallback(
    (p) => {
      progressRef.current = { ...progressRef.current, [p.caseId]: { status: 'ok', p } };
      setProgress(progressRef.current);
      return persist(p);
    },
    [persist],
  );

  /** Apply a game action to a case. Returns the engine result (plus `saved`). */
  const dispatch = useCallback(
    (caseId, action) => {
      const def = caseById(caseId);
      const entry = progressRef.current[caseId];
      if (!def || !entry?.p) return { ok: false, code: 'no_session' };
      const { p, r } = act(def, entry.p, action, config);
      if (p !== entry.p) {
        const saved = commit(p);
        r.saved = saved.ok;
      }
      listeners.current.forEach((fn) => fn(caseId, action, r, p));
      return r;
    },
    [commit, config],
  );

  /** Start, resume or replay a case. Replay resets only that case (keeping its best score). */
  const startCase = useCallback(
    (caseId, mode) => {
      const def = caseById(caseId);
      const entry = progressRef.current[caseId];
      if (mode === 'resume' && entry?.p && !entry.p.completed) return entry.p;
      const prev = entry?.p;
      const p = newProgress(def, prev ? prev.run + 1 : 1, prev?.best ?? null);
      commit(p);
      return p;
    },
    [commit],
  );

  /** Discard an unreadable save for one case (explicit user action). */
  const discardCase = useCallback(
    (caseId) => {
      const next = { ...progressRef.current };
      delete next[caseId];
      progressRef.current = next;
      setProgress(next);
      store.remove(KEYS.case(caseId, scope));
    },
    [scope],
  );

  const switchScope = useCallback((nextScope, cfg = DEFAULT_CONFIG) => {
    setScope(nextScope);
    setConfig(cfg);
    setProgress(loadAll(nextScope, progressRef));
  }, []);

  const subscribe = useCallback((fn) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  const value = useMemo(
    () => ({ progress, config, scope, saveError, dispatch, startCase, discardCase, switchScope, subscribe, storageAvailable: store.available }),
    [progress, config, scope, saveError, dispatch, startCase, discardCase, switchScope, subscribe],
  );
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

function loadAll(scope, ref) {
  const out = {};
  for (const def of CASES) {
    const res = loadCase(store, def, scope);
    if (res.status === 'empty') continue;
    out[def.id] = res.status === 'ok' || res.status === 'repaired' ? { status: res.status, p: res.p, problems: res.problems } : { status: res.status, problems: res.problems };
    if (res.status === 'repaired') saveCase(store, res.p, scope);
  }
  ref.current = out;
  return out;
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame outside provider');
  return ctx;
}

/** Status of a case for the selection screen — derived only from real saved data. */
export function caseStatus(entry) {
  if (!entry) return 'new';
  if (!entry.p) return 'unreadable';
  if (entry.p.completed) return 'completed';
  return 'inProgress';
}

/** The most recent resumable (in-progress) case, if any. */
export function resumable(progress) {
  let best = null;
  for (const [id, e] of Object.entries(progress)) {
    if (e?.p && !e.p.completed && (!best || e.p.updatedAt > best.p.updatedAt)) best = { id, p: e.p };
  }
  return best;
}
