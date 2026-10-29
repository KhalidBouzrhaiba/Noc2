import { useCallback, useEffect, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { EV } from '../core/locales/events.js';
import { useEvents } from '../events/EventProvider.jsx';
import { useGame, caseStatus } from '../game/GameProvider.jsx';
import { caseById } from '../content/index.js';
import { cleanCode, cleanName, validCode, validName, playable } from '../events/rules.js';
import TopControls from '../ui/TopControls.jsx';
import Leaderboard from '../ui/Leaderboard.jsx';
import { CaseMotif } from '../art/CaseMotifs.jsx';

export function evError(t, f, code) {
  const key = `err_${code}`;
  return EV[key] ? t(EV[key]) : f(EV.err_generic, { code });
}

export default function Events({ onBack, onPlay }) {
  const { t, f } = useSettings();
  const { api, active, enter, leave, sync } = useEvents();
  const { progress } = useGame();
  const [mine, setMine] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState(null);

  const loadMine = useCallback(async () => {
    if (!api) return;
    try {
      if (await api.session()) setMine(await api.myEvents());
    } catch {
      setMine([]);
    }
  }, [api]);
  useEffect(() => {
    loadMine();
  }, [loadMine]);

  const open = useCallback(
    async (eventId) => {
      setBusy(true);
      setError(null);
      try {
        const st = await api.state(eventId);
        setState(st);
        enter({ eventId, memberId: st.member?.id, name: st.member?.display_name, event: st.event });
      } catch (e) {
        setError(e.code ?? 'network');
      } finally {
        setBusy(false);
      }
    },
    [api, enter],
  );

  // refresh the official score/state while the hub is open
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(async () => {
      try {
        setState(await api.state(active.eventId));
      } catch {
        /* the hub keeps the last known state */
      }
    }, 20000);
    return () => clearInterval(id);
  }, [active, api]);

  const join = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!validCode(code)) return setError('unknown_code');
    if (!validName(name)) return setError('invalid_name');
    setBusy(true);
    try {
      await api.ensurePlayer();
      const r = await api.join(cleanCode(code), cleanName(name));
      if (!r.ok) setError(r.code);
      else {
        await loadMine();
        await open(r.event_id);
      }
    } catch (err) {
      setError(err.code ?? 'network');
    } finally {
      setBusy(false);
    }
  };

  if (!api) return <main className="screen events"><p className="muted">{t(UI.loading)}</p></main>;

  const ev = state?.event;
  return (
    <main className="screen events" aria-labelledby="events-heading">
      <header className="cases__head">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            if (active) {
              leave();
              setState(null);
            } else onBack();
          }}
        >
          <span aria-hidden="true" className="flip-rtl">←</span> {t(UI.back)}
        </button>
        <TopControls compact />
      </header>
      {api.mode === 'dev' && (
        <p className="devbanner" role="note">
          {t(EV.devBanner)}
        </p>
      )}

      {!active || !ev ? (
        <section className="events__join">
          <h1 id="events-heading" className="cases__title">
            {t(EV.title)}
          </h1>
          <p className="muted">{t(EV.intro)}</p>
          <form className="events__form" onSubmit={join} noValidate>
            <label>
              <span>{t(EV.code)}</span>
              <input dir="ltr" autoCapitalize="characters" autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} maxLength={12} />
            </label>
            <label>
              <span>{t(EV.name)}</span>
              <input dir="auto" autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} aria-describedby="name-help" />
              <small id="name-help" className="muted">
                {t(EV.nameHelp)}
              </small>
            </label>
            {error && (
              <p className="feedback feedback--wrong" role="alert">
                {evError(t, f, error)}
              </p>
            )}
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {t(busy ? EV.joining : EV.join)}
            </button>
          </form>
          {mine.length > 0 && (
            <section className="events__mine">
              <h2>{t(EV.myEvents)}</h2>
              <ul>
                {mine.map((m) => (
                  <li key={m.event_id}>
                    <button type="button" className="map__row" onClick={() => open(m.event_id)} disabled={busy}>
                      <span className="map__row-name" dir="auto">
                        {m.name}
                      </span>
                      <span className="map__row-notes">
                        {t(EV[`status_${m.status}`])} · {f(EV.playingAs, { name: m.display_name })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      ) : (
        <section className="events__hub">
          <h1 id="events-heading" className="cases__title" dir="auto">
            {ev.name}
          </h1>
          <p className="events__status">
            <span className={`badge badge--ev-${ev.status}`}>{t(EV[`status_${ev.status}`])}</span> {f(EV.playingAs, { name: active.name })} ·{' '}
            {f(EV.officialScore, { n: state.score })}
          </p>
          {ev.description && (
            <p className="muted" dir="auto">
              {ev.description}
            </p>
          )}
          <SyncStatus sync={sync} />
          {!playable(ev.status) && <p className="feedback feedback--warn">{ev.status === 'paused' ? t(EV.err_event_paused) : t(EV.notActive)}</p>}
          <ul className="cases__desk events__cases">
            {ev.allowed_cases.map((id) => {
              const def = caseById(id);
              const st = caseStatus(progress[id]);
              return (
                <li key={id} className={`file file--${def.motif}`}>
                  <div className="file__cover">
                    <CaseMotif motif={def.motif} />
                    <span className="file__title">{t(def.title)}</span>
                    <span className={`stamp stamp--${st}`}>{t({ new: UI.caseNew, inProgress: UI.caseInProgress, completed: UI.caseCompleted, unreadable: UI.saveUnreadable }[st])}</span>
                  </div>
                  <div className="file__inside">
                    <button type="button" className="btn btn--primary" disabled={!playable(ev.status) || st === 'completed'} onClick={() => onPlay(id, st === 'inProgress' ? 'resume' : 'new')}>
                      {t(st === 'inProgress' ? UI.caseResume : EV.play)}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Leaderboard api={api} eventId={ev.id} status={ev.status} />
          <p className="muted">{t(EV.localNote)}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              leave();
              setState(null);
              onBack();
            }}
          >
            {t(EV.leave)}
          </button>
        </section>
      )}
    </main>
  );
}

export function SyncStatus({ sync }) {
  const { t, f } = useSettings();
  if (!sync) return null;
  const last = sync.rejected?.at(-1);
  return (
    <div className="sync" role="status">
      {sync.error ? (
        <p className="feedback feedback--warn">{t(EV.syncError)}</p>
      ) : sync.pending > 0 ? (
        <p className="muted">{f(EV.syncPending, { n: sync.pending })}</p>
      ) : (
        <p className="muted">{t(EV.syncOk)}</p>
      )}
      {last && <p className="feedback feedback--wrong">{f(EV.syncRejected, { what: `${last.op} (${last.code})` })}</p>}
    </div>
  );
}
