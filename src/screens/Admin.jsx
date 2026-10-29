import { useCallback, useEffect, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { EV } from '../core/locales/events.js';
import { useEvents } from '../events/EventProvider.jsx';
import { CASES } from '../content/index.js';
import { TRANSITIONS, toCSV, validateEventInput, cleanCode } from '../events/rules.js';
import { DEFAULT_CONFIG } from '../game/config.js';
import Modal from '../ui/Modal.jsx';
import TopControls from '../ui/TopControls.jsx';
import Leaderboard from '../ui/Leaderboard.jsx';
import { evError } from './Events.jsx';

/** Organizer interface. Every action is authorized by the server; hiding a button is not security. */
export default function Admin({ onExit }) {
  const { t, f } = useSettings();
  const { api } = useEvents();
  const [who, setWho] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState({ name: 'list' });

  const refreshWho = useCallback(async () => {
    if (!api) return;
    try {
      const s = await api.session();
      if (!s || s.anonymous) return setWho({ signedIn: false });
      const w = await api.admin.whoami();
      setWho({ signedIn: true, isAdmin: w.is_admin, email: s.email });
    } catch (e) {
      setError(e.code ?? 'network');
      setWho({ signedIn: false });
    }
  }, [api]);
  useEffect(() => {
    refreshWho();
  }, [refreshWho]);

  if (!api) return <main className="screen admin"><p className="muted">{t(UI.loading)}</p></main>;

  return (
    <main className="screen admin" aria-labelledby="admin-heading">
      <header className="cases__head">
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          <span aria-hidden="true" className="flip-rtl">←</span> {t(UI.menuToTitle)}
        </button>
        <TopControls compact />
      </header>
      {api.mode === 'dev' && <p className="devbanner">{t(EV.devBanner)}</p>}
      <h1 id="admin-heading" className="cases__title">
        {t(EV.adTitle)}
      </h1>
      {error && <p className="feedback feedback--wrong">{evError(t, f, error)}</p>}
      {who === null ? (
        <p className="muted">{t(UI.loading)}</p>
      ) : !who.signedIn ? (
        <SignIn api={api} onDone={refreshWho} />
      ) : !who.isAdmin ? (
        <div className="admin__panel">
          <p className="feedback feedback--warn">{t(EV.adNotAdmin)}</p>
          <button type="button" className="btn btn--secondary" onClick={async () => { await api.signOut(); refreshWho(); }}>
            {t(EV.adSignOut)}
          </button>
        </div>
      ) : (
        <>
          <p className="admin__who muted">
            {who.email}{' '}
            <button type="button" className="btn btn--ghost" onClick={async () => { await api.signOut(); refreshWho(); }}>
              {t(EV.adSignOut)}
            </button>
          </p>
          {view.name === 'list' && <EventList api={api} onOpen={(id) => setView({ name: 'detail', id })} onNew={() => setView({ name: 'new' })} />}
          {view.name === 'new' && (
            <div className="admin__panel">
              <h2>{t(EV.adNew)}</h2>
              <EventForm api={api} onSaved={(e) => setView({ name: 'detail', id: e.id })} onCancel={() => setView({ name: 'list' })} />
            </div>
          )}
          {view.name === 'detail' && <EventDetail api={api} id={view.id} onBack={() => setView({ name: 'list' })} />}
        </>
      )}
    </main>
  );
}

function SignIn({ api, onDone }) {
  const { t, f } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  return (
    <form
      className="admin__panel events__form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await api.signInAdmin(email.trim(), password);
          onDone();
        } catch (err) {
          setError(err.code ?? 'auth_failed');
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>{t(EV.adSignIn)}</h2>
      {api.mode === 'dev' && <p className="muted">{t(EV.adDevNote)}</p>}
      <label>
        <span>{t(EV.adEmail)}</span>
        <input type="email" dir="ltr" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        <span>{t(EV.adPassword)}</span>
        <input type="password" dir="ltr" autoComplete="current-password" required={api.mode !== 'dev'} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="feedback feedback--wrong">{evError(t, f, error)}</p>}
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {t(EV.adSignInBtn)}
      </button>
    </form>
  );
}

function EventList({ api, onOpen, onNew }) {
  const { t, f } = useSettings();
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    api.admin.events().then(setEvents).catch((e) => setError(e.code ?? 'network'));
  }, [api]);
  return (
    <section className="admin__panel">
      <div className="lb__head">
        <h2>{t(EV.adEvents)}</h2>
        <button type="button" className="btn btn--primary" onClick={onNew}>
          {t(EV.adNew)}
        </button>
      </div>
      {error && <p className="feedback feedback--wrong">{evError(t, f, error)}</p>}
      {events && events.length === 0 && <p className="muted">{t(EV.adNoEvents)}</p>}
      {events && events.length > 0 && (
        <ul className="admin__events">
          {events.map((e) => (
            <li key={e.id}>
              <button type="button" className="map__row" onClick={() => onOpen(e.id)}>
                <span className="map__row-name" dir="auto">
                  {e.name}
                </span>
                <span className="map__row-notes">
                  {t(EV[`status_${e.status}`])} · {t(EV.adCode)}: <span dir="ltr">{e.access_code}</span> · {t(EV.adParticipants)}: {e.participants}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

function EventForm({ api, event, onSaved, onCancel }) {
  const { t, f } = useSettings();
  const [v, setV] = useState(() => ({
    name: event?.name ?? '',
    description: event?.description ?? '',
    access_code: event?.access_code ?? '',
    starts_at: toLocalInput(event?.starts_at),
    ends_at: toLocalInput(event?.ends_at),
    allowed_cases: event?.allowed_cases ?? CASES.map((c) => c.id),
    hint_costs: event?.hint_costs ?? [...DEFAULT_CONFIG.hints.costs],
    start_balance: event?.start_balance ?? DEFAULT_CONFIG.hints.startBalance,
    max_participants: event?.max_participants ?? 200,
  }));
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));
  const labels = { name: EV.adName, description: EV.adDescription, access_code: EV.adCode, allowed_cases: EV.adCases, hint_costs: EV.adHintCosts, start_balance: EV.adStartBalance, max_participants: EV.adMax, ends_at: EV.adEnds };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: v.name.trim(),
      description: v.description.trim(),
      allowed_cases: v.allowed_cases,
      hint_costs: v.hint_costs.map((x) => Number(x)),
      start_balance: Number(v.start_balance),
      max_participants: Number(v.max_participants),
      starts_at: v.starts_at ? new Date(v.starts_at).toISOString() : null,
      ends_at: v.ends_at ? new Date(v.ends_at).toISOString() : null,
    };
    if (!event && v.access_code) payload.access_code = cleanCode(v.access_code);
    const errs = validateEventInput(payload);
    setErrors(errs);
    if (errs.length) return;
    setBusy(true);
    setServerError(null);
    try {
      const r = await api.admin.saveEvent(event?.id ?? null, payload);
      if (!r.ok) setServerError(r.code);
      else onSaved(r.event);
    } catch (err) {
      setServerError(err.code ?? 'network');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="events__form admin__form" onSubmit={submit} noValidate>
      <label>
        <span>{t(EV.adName)}</span>
        <input dir="auto" required maxLength={80} value={v.name} onChange={(e) => set('name', e.target.value)} />
      </label>
      <label>
        <span>{t(EV.adDescription)}</span>
        <textarea dir="auto" maxLength={500} rows={3} value={v.description} onChange={(e) => set('description', e.target.value)} />
      </label>
      {!event && (
        <label>
          <span>{t(EV.adCode)}</span>
          <input dir="ltr" maxLength={12} placeholder={t(EV.adCodeAuto)} value={v.access_code} onChange={(e) => set('access_code', e.target.value.toUpperCase())} />
        </label>
      )}
      <div className="row">
        <label>
          <span>{t(EV.adStarts)}</span>
          <input type="datetime-local" dir="ltr" value={v.starts_at} onChange={(e) => set('starts_at', e.target.value)} />
        </label>
        <label>
          <span>{t(EV.adEnds)}</span>
          <input type="datetime-local" dir="ltr" value={v.ends_at} onChange={(e) => set('ends_at', e.target.value)} />
        </label>
      </div>
      <fieldset>
        <legend>{t(EV.adCases)}</legend>
        {CASES.map((c) => (
          <label key={c.id} className="check">
            <input
              type="checkbox"
              checked={v.allowed_cases.includes(c.id)}
              onChange={(e) => set('allowed_cases', e.target.checked ? [...v.allowed_cases, c.id] : v.allowed_cases.filter((x) => x !== c.id))}
            />
            <span>{t(c.title)}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t(EV.adHintCosts)}</legend>
        <div className="row">
          {v.hint_costs.map((c, i) => (
            <input
              key={i}
              type="number"
              inputMode="numeric"
              min={0}
              max={200}
              dir="ltr"
              aria-label={`${t(EV.adHintCosts)} ${i + 1}`}
              className="admin__num"
              value={c}
              onChange={(e) => set('hint_costs', v.hint_costs.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ))}
        </div>
      </fieldset>
      <div className="row">
        <label>
          <span>{t(EV.adStartBalance)}</span>
          <input type="number" min={0} max={500} dir="ltr" className="admin__num" value={v.start_balance} onChange={(e) => set('start_balance', e.target.value)} />
        </label>
        <label>
          <span>{t(EV.adMax)}</span>
          <input type="number" min={1} max={1000} dir="ltr" className="admin__num" value={v.max_participants} onChange={(e) => set('max_participants', e.target.value)} />
        </label>
      </div>
      {errors.length > 0 && <p className="feedback feedback--wrong">{f(EV.adInvalid, { fields: errors.map((k) => t(labels[k] ?? EV.adName)).join(', ') })}</p>}
      {serverError && <p className="feedback feedback--wrong">{evError(t, f, serverError)}</p>}
      <div className="row">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {t(EV.adSave)}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          {t(UI.cancel)}
        </button>
      </div>
    </form>
  );
}

function EventDetail({ api, id, onBack }) {
  const { t, f, locale } = useSettings();
  const [d, setD] = useState(null);
  const [audit, setAudit] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(null); // { kind:'status', to } | { kind:'reset', member }
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    try {
      const det = await api.admin.detail(id);
      if (!det.ok) return setError(det.code);
      setD(det);
      setAudit(await api.admin.audit(id));
      setError(null);
    } catch (e) {
      setError(e.code ?? 'network');
    }
  }, [api, id]);
  useEffect(() => {
    load();
    const t2 = setInterval(() => document.visibilityState === 'visible' && load(), 30000);
    return () => clearInterval(t2);
  }, [load]);

  const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString(locale === 'dar' ? 'ar-MA' : locale) : '—');

  const doConfirm = async () => {
    const c = confirm;
    setConfirm(null);
    try {
      const r = c.kind === 'status' ? await api.admin.setStatus(id, c.to) : await api.admin.resetMember(id, c.member.id);
      setNotice(r.ok ? null : evError(t, f, r.code));
      await load();
    } catch (e) {
      setNotice(evError(t, f, e.code ?? 'network'));
    }
  };

  const exportCsv = async () => {
    try {
      const rows = await api.admin.exportRows(id);
      const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `noctaviae-${d.event.access_code}-results.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      load();
    } catch (e) {
      setNotice(evError(t, f, e.code ?? 'network'));
    }
  };

  if (error) return <p className="feedback feedback--wrong">{evError(t, f, error)}</p>;
  if (!d) return <p className="muted">{t(UI.loading)}</p>;
  const e = d.event;
  const closed = ['completed', 'cancelled'].includes(e.status);
  return (
    <section className="admin__detail">
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        <span aria-hidden="true" className="flip-rtl">←</span> {t(EV.adBack)}
      </button>
      <div className="admin__panel">
        <h2 dir="auto">{e.name}</h2>
        <p>
          <span className={`badge badge--ev-${e.status}`}>{t(EV[`status_${e.status}`])}</span> · {t(EV.adCode)}:{' '}
          <strong dir="ltr" className="admin__code">
            {e.access_code}
          </strong>{' '}
          · {t(EV.adParticipants)}: {e.participants}/{e.max_participants}
        </p>
        <p className="muted">
          {t(EV.adStarts)}: {fmtTime(e.starts_at)} · {t(EV.adEnds)}: {fmtTime(e.ends_at)}
        </p>
        {notice && <p className="feedback feedback--wrong">{notice}</p>}
        <h3>{t(EV.adActions)}</h3>
        <div className="row">
          {TRANSITIONS[e.status].map((to) => (
            <button key={to} type="button" className={`btn ${to === 'cancelled' || to === 'completed' ? 'btn--danger' : 'btn--secondary'}`} onClick={() => setConfirm({ kind: 'status', to })}>
              {t(EV[`adTo_${to}`])}
            </button>
          ))}
          {!closed && (
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(!editing)}>
              {t(EV.adEdit)}
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={load}>
            {t(EV.adRefresh)}
          </button>
          <button type="button" className="btn btn--ghost" onClick={exportCsv}>
            {t(EV.adExport)}
          </button>
        </div>
        {editing && (
          <EventForm
            api={api}
            event={e}
            onSaved={() => {
              setEditing(false);
              load();
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>

      <div className="admin__panel">
        <h3>{t(EV.adMembers)}</h3>
        {d.members.length === 0 ? (
          <p className="muted">{t(EV.adNoMembers)}</p>
        ) : (
          <div className="table-wrap">
            <table className="lb__table">
              <thead>
                <tr>
                  <th scope="col">{t(EV.lbName)}</th>
                  <th scope="col">{t(EV.lbScore)}</th>
                  <th scope="col">{t(EV.adColPuzzles)}</th>
                  <th scope="col">{t(EV.adColHints)}</th>
                  <th scope="col">{t(EV.adColDone)}</th>
                  <th scope="col">{t(EV.adColLast)}</th>
                  <th scope="col">
                    <span className="sr-only">{t(EV.adReset)}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.members.map((m) => (
                  <tr key={m.id}>
                    <td dir="auto">{m.display_name}</td>
                    <td>{m.score}</td>
                    <td>{m.puzzles}</td>
                    <td>{m.hints}</td>
                    <td>{Object.keys(m.completed).length}</td>
                    <td>{fmtTime(m.last_activity)}</td>
                    <td>
                      <button type="button" className="btn btn--ghost" onClick={() => setConfirm({ kind: 'reset', member: m })}>
                        {t(EV.adReset)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin__grid">
        <div className="admin__panel">
          <Leaderboard api={api} eventId={id} status={e.status} compact />
        </div>
        <div className="admin__panel">
          <h3>{t(EV.adStats)}</h3>
          <h4>{t(EV.adCompletions)}</h4>
          <ul className="admin__stats">
            {CASES.filter((c) => e.allowed_cases.includes(c.id)).map((c) => (
              <li key={c.id}>
                {t(c.title)}: <strong>{d.stats.completions[c.id] ?? 0}</strong> / {d.stats.participants}
              </li>
            ))}
          </ul>
          <h4>{t(EV.adPuzzleMilestones)}</h4>
          <ul className="admin__stats">
            {Object.entries(d.stats.puzzles).map(([k, n]) => {
              const [cid, pid] = k.split('/');
              const c = CASES.find((x) => x.id === cid);
              return (
                <li key={k}>
                  {c ? `${t(c.title)} — ${t(c.puzzles[pid]?.title ?? pid)}` : k}: <strong>{n}</strong>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="admin__panel">
        <h3>{t(EV.adAudit)}</h3>
        <ol className="admin__audit">
          {audit.map((a, i) => (
            <li key={i}>
              <time>{fmtTime(a.at)}</time> <code>{a.action}</code> {a.member && <span dir="auto">· {a.member}</span>} {a.by_admin && <em>· {t(EV.adByAdmin)}</em>}
              {a.details?.to && <span> → {t(EV[`status_${a.details.to}`])}</span>}
            </li>
          ))}
        </ol>
      </div>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.kind === 'status' ? t(EV[`adTo_${confirm.to}`]) : t(EV.adReset)} className="confirm">
        {confirm && (
          <>
            <p>{confirm.kind === 'status' ? f(EV.adConfirm, { action: t(EV[`adTo_${confirm.to}`]) }) : f(EV.adResetConfirm, { name: confirm.member.display_name })}</p>
            {(confirm.kind === 'reset' || ['completed', 'cancelled'].includes(confirm.to)) && <p className="feedback feedback--warn">{t(EV.adIrreversible)}</p>}
            <div className="row">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirm(null)}>
                {t(UI.cancel)}
              </button>
              <button type="button" className="btn btn--danger" onClick={doConfirm}>
                {t(UI.confirm)}
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
