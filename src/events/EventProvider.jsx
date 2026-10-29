import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { eventsMode, getApi } from './api.js';
import { createSync, opsFromResult } from './sync.js';
import { useGame } from '../game/GameProvider.jsx';
import { mergeConfig } from '../game/config.js';

const EventCtx = createContext(null);
const ACTIVE_KEY = 'noctaviae:event:active';
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

/**
 * Event play: an authenticated (anonymous) player joins an event; their progress is kept in a
 * separate local scope ("event:<id>") and mirrored to the server, which computes the official score.
 */
export function EventProvider({ children }) {
  const mode = eventsMode();
  const { switchScope, subscribe } = useGame();
  const [api, setApi] = useState(null);
  const [active, setActive] = useState(null); // { eventId, memberId, name, event }
  const [sync, setSync] = useState(null);
  const syncRef = useRef(null);

  useEffect(() => {
    if (!mode) return;
    let alive = true;
    getApi().then((a) => alive && setApi(a));
    return () => {
      alive = false;
    };
  }, [mode]);

  // Mirror every game result while playing in an event.
  useEffect(() => {
    if (!active) return undefined;
    return subscribe((caseId, action, r) => {
      if (action.type === 'hint' || action.type === 'time') return; // hints are server-first, time is local
      syncRef.current?.enqueue(opsFromResult(caseId, action, r));
    });
  }, [active, subscribe]);

  const enter = useCallback(
    (info) => {
      syncRef.current?.stop();
      const s = createSync(api, info.eventId, setSync);
      syncRef.current = s;
      setSync(s.state());
      setActive(info);
      try {
        localStorage.setItem(ACTIVE_KEY, JSON.stringify({ eventId: info.eventId }));
      } catch {
        /* optional */
      }
      switchScope(`event:${info.eventId}`, mergeConfig({ hintCosts: info.event.hint_costs, startBalance: info.event.start_balance }));
      s.flush();
    },
    [api, switchScope],
  );

  const leave = useCallback(() => {
    syncRef.current?.stop();
    syncRef.current = null;
    setActive(null);
    setSync(null);
    try {
      localStorage.removeItem(ACTIVE_KEY);
    } catch {
      /* optional */
    }
    switchScope('solo');
  }, [switchScope]);

  /** Server-first hint purchase. The hint is only shown after the server confirms it. */
  const buyHint = useCallback(
    async (caseId, target, level) => {
      if (!active || !api) return { ok: false, code: 'no_event' };
      await syncRef.current?.flush(); // make sure prerequisites are recorded first
      try {
        const res = await api.buyHint(active.eventId, caseId, target, level, uuid());
        return res;
      } catch (e) {
        return { ok: false, code: e.code ?? 'network' };
      }
    },
    [active, api],
  );

  const value = useMemo(() => ({ mode, api, active, sync, enter, leave, buyHint }), [mode, api, active, sync, enter, leave, buyHint]);
  return <EventCtx.Provider value={value}>{children}</EventCtx.Provider>;
}

export const useEvents = () => useContext(EventCtx);
