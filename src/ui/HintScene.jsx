import { useMemo, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { EV } from '../core/locales/events.js';
import { audio } from '../core/audio.js';
import { NOCTAVIAE } from '../content/noctaviae.js';
import { check } from '../game/conditions.js';
import { activeObjectives, hintBalance, purchasedLevels } from '../game/engine.js';
import Noctaviae from '../art/Noctaviae.jsx';

const LEVEL_NAMES = [UI.hintLevel1, UI.hintLevel2, UI.hintLevel3];

/** Topics Noctaviae can talk about: reachable unsolved puzzles first, then anything already bought. */
function topics(def, p) {
  const list = [];
  for (const pz of Object.values(def.puzzles)) {
    const open = check(pz.requires, p) && !p.solved.includes(pz.id);
    const bought = purchasedLevels(p, pz.id).length > 0;
    if (open || bought) list.push({ id: pz.id, title: pz.title, solved: p.solved.includes(pz.id), target: pz });
  }
  if (check(def.final.requires, p) && !p.completed) list.push({ id: 'final', title: UI.hintFinal, solved: false, target: def.final });
  else if (purchasedLevels(p, 'final').length) list.push({ id: 'final', title: UI.hintFinal, solved: p.completed, target: def.final });
  return list.sort((a, b) => Number(a.solved) - Number(b.solved));
}

export default function HintScene({ def, p, cfg, onBuy }) {
  const { t, f } = useSettings();
  const list = useMemo(() => topics(def, p), [def, p]);
  const [topic, setTopic] = useState(list[0]?.id ?? null);
  const [confirm, setConfirm] = useState(null);
  const busy = useRef(false);
  const balance = hintBalance(def, p, cfg);
  const greet = NOCTAVIAE.greet[p.hints.length % NOCTAVIAE.greet.length];
  const current = list.find((x) => x.id === topic) ?? list[0];
  const objective = activeObjectives(def, p)[0];

  const [pending, setPending] = useState(false);
  const [refusal, setRefusal] = useState(null);
  const confirmShownAt = useRef(0);
  const askConfirm = (level) => {
    confirmShownAt.current = Date.now();
    setConfirm(level);
  };
  const buy = async (level) => {
    // the confirm button appears where "buy" was: ignore the second half of a double click
    if (busy.current || Date.now() - confirmShownAt.current < 400) return;
    busy.current = true;
    setPending(true);
    setRefusal(null);
    // a fresh transaction id per confirmed purchase; duplicates are ignored by the engine and server
    const tx = `${current.id}:${level}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    try {
      const r = await onBuy(current.id, level, tx);
      if (r?.code === 'purchased') audio.play('pour');
      if (r?.code === 'server_refused') setRefusal(r.reason);
    } finally {
      setConfirm(null);
      setPending(false);
      busy.current = false;
    }
  };

  return (
    <div className="tea">
      <div className="tea__scene" aria-hidden="true">
        <TeaCorner />
        <Noctaviae className="tea__cat" />
      </div>
      <div className="tea__talk">
        <p className="tea__speech">
          <span className="tea__name">{t(NOCTAVIAE.name)}</span> {t(greet)}
        </p>
        <p className="tea__balance">{f(UI.hintBalance, { n: balance })}</p>

        {p.completed ? (
          <p className="tea__speech">{t(NOCTAVIAE.completed)}</p>
        ) : list.length === 0 ? (
          <p className="tea__speech">{objective ? f(NOCTAVIAE.objectiveNudge, { objective: t(objective.text) }) : t(NOCTAVIAE.nothingOpen)}</p>
        ) : null}

        {list.length > 0 && (
          <>
            <fieldset className="tea__topics">
              <legend>{t(UI.hintChoose)}</legend>
              {list.map((x) => (
                <label key={x.id} className="option">
                  <input
                    type="radio"
                    name="hint-topic"
                    checked={current?.id === x.id}
                    onChange={() => {
                      setTopic(x.id);
                      setConfirm(null);
                    }}
                  />
                  <span>
                    {t(x.title)} {x.solved && <span className="badge badge--ok">{t(UI.hintSolvedTag)}</span>}
                  </span>
                </label>
              ))}
            </fieldset>

            {current && (
              <ol className="tea__levels">
                {[1, 2, 3].map((level) => {
                  const bought = purchasedLevels(p, current.id).includes(level);
                  const prevOk = level === 1 || purchasedLevels(p, current.id).includes(level - 1);
                  const cost = cfg.hints.costs[level - 1];
                  const afford = balance >= cost;
                  return (
                    <li key={level} className={`level ${bought ? 'level--bought' : ''}`}>
                      <div className="level__head">
                        <span className="level__name">
                          {level}. {t(LEVEL_NAMES[level - 1])}
                        </span>
                        <span className="level__cost">{f(UI.hintCost, { n: cost })}</span>
                      </div>
                      {bought ? (
                        <p className="level__text">{t(current.target.hints[level - 1])}</p>
                      ) : !prevOk ? (
                        <p className="muted">{t(UI.hintLockedPrev)}</p>
                      ) : !afford ? (
                        <p className="muted">
                          {f(UI.hintTooExpensive, { n: cost, b: balance })} {t(NOCTAVIAE.cantAfford)}
                        </p>
                      ) : confirm === level ? (
                        <div className="level__confirm" role="group">
                          <p>{f(UI.hintConfirm, { cost, balance })}</p>
                          <button type="button" className="btn btn--primary" onClick={() => buy(level)} disabled={pending} aria-busy={pending}>
                            {t(pending ? UI.loading : UI.hintYes)}
                          </button>
                          <button type="button" className="btn btn--ghost" onClick={() => Date.now() - confirmShownAt.current >= 400 && setConfirm(null)}>
                            {t(UI.cancel)}
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="btn btn--secondary" onClick={() => askConfirm(level)}>
                          {f(UI.hintBuy, { n: cost })}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
        {refusal && (
          <p className="feedback feedback--wrong" role="alert">
            {f(EV.hintServerFail, { reason: refusal })}
          </p>
        )}
        <p className="tea__policy muted">{t(UI.hintPolicy)}</p>
      </div>
    </div>
  );
}

function TeaCorner() {
  return (
    <svg className="tea__corner" viewBox="0 0 600 420" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="tea-lamp" cx=".5" cy=".4" r=".55">
          <stop offset="0" stopColor="#ffbf5c" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffbf5c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tea-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1418" />
          <stop offset="1" stopColor="#2c1e18" />
        </linearGradient>
        <linearGradient id="tea-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7c26a" />
          <stop offset=".5" stopColor="#b88a30" />
          <stop offset="1" stopColor="#7a5a1c" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" fill="url(#tea-wall)" />
      <path d="M0 300h600v120H0z" fill="#3a2618" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${i * 90} 300l-40 120`} stroke="#2a1a10" strokeWidth="3" />)}
      {/* zellige band */}
      {Array.from({ length: 15 }, (_, i) => (
        <path key={i} d={`M${i * 40 + 20} 262l20 20-20 20-20-20z`} fill={['#2f5d5a', '#8f3a24', '#c99a3b'][i % 3]} opacity=".55" />
      ))}
      {/* lantern */}
      <path d="M150 0v60" stroke="#6a4a1c" strokeWidth="3" />
      <ellipse cx="150" cy="140" rx="160" ry="150" fill="url(#tea-lamp)" className="flicker" />
      <path d="M128 60h44l10 20H118z" fill="#8a6a2a" />
      <path d="M120 80h60l-6 80h-48z" fill="#3a2a14" />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => <circle key={`${r}${c}`} cx={132 + c * 12} cy={98 + r * 20} r="4" fill="#ffcf7a" opacity=".85" />),
      )}
      <path d="M126 160h48l-8 14h-32z" fill="#8a6a2a" />
      {/* tray (siniya) */}
      <ellipse cx="330" cy="352" rx="150" ry="30" fill="#000" opacity=".35" />
      <ellipse cx="330" cy="340" rx="150" ry="32" fill="url(#tea-brass)" />
      <ellipse cx="330" cy="336" rx="132" ry="25" fill="none" stroke="#7a5a1c" strokeWidth="2" strokeDasharray="4 6" />
      <path d="M200 340c0 18 260 18 260 0v14c0 18-260 18-260 0z" fill="#7a5a1c" />
      {/* teapot (berrad) */}
      <path d="M296 330c-26 0-34-28-24-44 6-10 18-14 30-14s24 4 30 14c10 16 2 44-24 44z" fill="url(#tea-brass)" />
      <path d="M332 296c20-6 30-24 34-34" stroke="#b88a30" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M272 300c-14 0-20 14-12 22" stroke="#b88a30" strokeWidth="5" fill="none" />
      <path d="M290 272c0-14 24-14 24 0z" fill="#b88a30" />
      <circle cx="302" cy="258" r="5" fill="#b88a30" />
      {/* steam */}
      <path className="steam" d="M368 252c-8-14 8-20 0-34s6-22 0-30" stroke="#e8e0d0" strokeOpacity=".35" strokeWidth="3" fill="none" />
      {/* tea glasses */}
      {[[370, '#3c6a52'], [400, '#7a2a3a'], [250, '#3c4a7a']].map(([x, c]) => (
        <g key={x}>
          <path d={`M${x - 10} 300h20l-3 34h-14z`} fill={c} opacity=".75" />
          <path d={`M${x - 8} 310h16l-2 22h-12z`} fill="#a85a18" opacity=".8" />
          <path d={`M${x - 10} 300h20`} stroke="#e7c26a" strokeWidth="2" />
          <path d={`M${x - 9} 316h18`} stroke="#e7c26a" strokeWidth="1" opacity=".7" />
        </g>
      ))}
      <path d="M220 326l-8 6M232 330l-4 6" stroke="#f3e8cf" strokeWidth="3" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}
