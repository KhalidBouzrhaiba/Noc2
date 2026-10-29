import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { EV } from '../core/locales/events.js';

/**
 * Leaderboard from validated server data. Uses polling (every 20 s while visible), not
 * a live socket — it is described honestly as such in the interface.
 */
export default function Leaderboard({ api, eventId, status, compact = false }) {
  const { t, f, locale } = useSettings();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(null);
  const busy = useRef(false);

  const load = useCallback(async () => {
    if (busy.current || !api) return;
    busy.current = true;
    try {
      const data = await api.leaderboard(eventId);
      setRows(data ?? []);
      setError(null);
      setUpdated(new Date());
    } catch (e) {
      setError(e.code ?? 'network');
    } finally {
      busy.current = false;
    }
  }, [api, eventId]);

  useEffect(() => {
    load();
    const id = setInterval(() => document.visibilityState === 'visible' && load(), 20000);
    return () => clearInterval(id);
  }, [load]);

  const notStarted = ['draft', 'scheduled', 'open'].includes(status);
  return (
    <section className={`lb ${compact ? 'lb--compact' : ''}`} aria-labelledby={`lb-${eventId}`}>
      <div className="lb__head">
        <h2 id={`lb-${eventId}`}>{t(status === 'completed' ? EV.lbFinal : EV.lbTitle)}</h2>
        <button type="button" className="btn btn--ghost" onClick={load}>
          {t(EV.lbRefresh)}
        </button>
      </div>
      {error && <p className="feedback feedback--warn">{t(EV.lbUnavailable)}</p>}
      {rows && rows.length === 0 && <p className="muted">{t(EV.lbEmpty)}</p>}
      {rows && rows.length > 0 && (
        <>
          {notStarted && <p className="muted">{t(EV.lbNotStarted)}</p>}
          <ol className="lb__podium">
            {rows.slice(0, 3).map((r) => (
              <li key={`${r.rank}-${r.display_name}`} className={`lb__top lb__top--${r.rank}`}>
                <span className="lb__medal" aria-hidden="true">
                  {r.rank}
                </span>
                <span className="lb__name" dir="auto">
                  {r.display_name} {r.is_me && <em>{t(EV.lbYou)}</em>}
                </span>
                <span className="lb__score">{r.score}</span>
              </li>
            ))}
          </ol>
          {rows.length > 3 && (
            <table className="lb__table">
              <thead>
                <tr>
                  <th scope="col">{t(EV.lbRank)}</th>
                  <th scope="col">{t(EV.lbName)}</th>
                  <th scope="col">{t(EV.lbScore)}</th>
                  <th scope="col">{t(EV.lbCases)}</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(3).map((r) => (
                  <tr key={`${r.rank}-${r.display_name}`} className={r.is_me ? 'is-me' : ''}>
                    <td>{r.rank}</td>
                    <td dir="auto">
                      {r.display_name} {r.is_me && <em>{t(EV.lbYou)}</em>}
                    </td>
                    <td>{r.score}</td>
                    <td>{r.cases_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      <p className="muted lb__rule">{t(EV.lbTieRule)}</p>
      <p className="muted">
        {t(EV.lbPolling)} {updated && f(EV.lbUpdated, { time: updated.toLocaleTimeString(locale === 'dar' ? 'ar-MA' : locale) })}
      </p>
    </section>
  );
}
