import { useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { locationById } from '../game/engine.js';
import DocView from './DocView.jsx';

const KIND_ORDER = ['record', 'document', 'object', 'photo', 'statement', 'rumor', 'inference'];

export default function Notebook({ def, p, onConnect, initialTab = 'evidence' }) {
  const { t } = useSettings();
  const [tab, setTab] = useState(initialTab);
  const tabs = [
    ['evidence', UI.nbEvidence],
    ['board', UI.nbBoard],
    ['contradictions', UI.nbContradictions],
  ];
  return (
    <div className="notebook">
      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" id={`nb-tab-${id}`} aria-selected={tab === id} aria-controls={`nb-panel-${id}`} className="tabs__tab" onClick={() => setTab(id)}>
            {t(label)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`nb-panel-${tab}`} aria-labelledby={`nb-tab-${tab}`} className="notebook__panel">
        {tab === 'evidence' && <Evidence def={def} p={p} />}
        {tab === 'board' && <Board def={def} p={p} onConnect={onConnect} />}
        {tab === 'contradictions' && <Contradictions def={def} p={p} />}
      </div>
    </div>
  );
}

function Evidence({ def, p }) {
  const { t } = useSettings();
  const [open, setOpen] = useState(null);
  if (!p.clues.length) return <p className="muted">{t(UI.nbEmpty)}</p>;
  const sorted = [...p.clues].sort((a, b) => KIND_ORDER.indexOf(def.clues[a].kind) - KIND_ORDER.indexOf(def.clues[b].kind));
  return (
    <div className="evidence">
      <ul className="evidence__list">
        {sorted.map((id) => {
          const c = def.clues[id];
          return (
            <li key={id}>
              <button type="button" className={`card card--${c.kind} ${open === id ? 'is-active' : ''}`} aria-pressed={open === id} onClick={() => setOpen(open === id ? null : id)}>
                <span className="card__kind">{t(UI[`kind_${c.kind}`])}</span>
                <span className="card__title">{t(c.title)}</span>
                <span className={`card__status card__status--${c.status}`}>{t(UI[`status_${c.status}`])}</span>
                <span className="card__from">{t(locationById(def, c.from).name)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {open && (
        <div className="evidence__doc">
          <DocView def={def} clueId={open} />
        </div>
      )}
    </div>
  );
}

function Board({ def, p, onConnect }) {
  const { t, f } = useSettings();
  const [sel, setSel] = useState([]);
  const [msg, setMsg] = useState(null);
  const toggle = (id) => {
    setMsg(null);
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 2 ? [s[1], id] : [...s, id]));
  };
  const connect = () => {
    if (sel.length !== 2) return;
    const r = onConnect(sel[0], sel[1]);
    if (r.code === 'no_link') setMsg({ kind: 'wrong', text: UI.boardNoLink });
    else if (r.code === 'already_linked') setMsg({ kind: 'warn', text: UI.boardAlready });
    else if (r.ok) {
      const d = def.deductions.find((x) => x.id === r.deduction);
      setMsg({ kind: 'ok', text: d.text });
      setSel([]);
    }
  };
  return (
    <div className="board">
      <p className="muted">{t(UI.boardIntro)}</p>
      {!p.clues.length ? (
        <p className="muted">{t(UI.nbEmpty)}</p>
      ) : (
        <ul className="board__pins">
          {p.clues.map((id) => {
            const c = def.clues[id];
            return (
              <li key={id}>
                <button type="button" className={`pin pin--${c.status}`} aria-pressed={sel.includes(id)} onClick={() => toggle(id)}>
                  <span className="pin__kind">{t(UI[`kind_${c.kind}`])}</span>
                  {t(c.title)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="board__bar">
        <span className="muted">{f(UI.boardSelected, { n: sel.length })}</span>
        <button type="button" className="btn btn--primary" disabled={sel.length !== 2} onClick={connect}>
          {t(UI.boardConnect)}
        </button>
      </div>
      {msg && (
        <p className={`feedback feedback--${msg.kind}`} role="status">
          {t(msg.text)}
        </p>
      )}
      <h3 className="board__h">{t(UI.boardLinks)}</h3>
      {p.deductions.length === 0 ? (
        <p className="muted">{t(UI.boardNoLinks)}</p>
      ) : (
        <ul className="links">
          {def.deductions
            .filter((d) => p.deductions.includes(d.id))
            .map((d) => (
              <li key={d.id} className="link">
                <span className="link__pair">
                  {t(def.clues[d.pair[0]].title)} <span aria-hidden="true">⟷</span> {t(def.clues[d.pair[1]].title)}
                </span>
                <span className="link__text">{t(d.text)}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function Contradictions({ def, p }) {
  const { t } = useSettings();
  const found = (def.contradictions ?? []).filter((c) => c.pair.every((x) => p.clues.includes(x)));
  if (!found.length) return <p className="muted">{t(UI.contraEmpty)}</p>;
  return (
    <>
    <p className="muted">{t(UI.contraHint)}</p>
    <ul className="contras">
      {found.map((c) => {
        const resolved = p.deductions.includes(c.resolvedBy);
        const d = def.deductions.find((x) => x.id === c.resolvedBy);
        return (
          <li key={c.id} className={`contra ${resolved ? 'contra--resolved' : ''}`}>
            <span className="contra__pair">
              {t(def.clues[c.pair[0]].title)} <em>{t(UI.contraVs)}</em> {t(def.clues[c.pair[1]].title)}
            </span>
            <span className={`badge ${resolved ? 'badge--ok' : 'badge--open'}`}>{t(resolved ? UI.contraResolved : UI.contraOpen)}</span>
            {resolved && <span className="contra__text">{t(d.text)}</span>}
          </li>
        );
      })}
    </ul>
    </>
  );
}
