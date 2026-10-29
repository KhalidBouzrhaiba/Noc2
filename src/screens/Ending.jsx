import { useEffect, useRef } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { NOCTAVIAE } from '../content/noctaviae.js';
import { scoreBreakdown, scoreOf } from '../game/engine.js';
import { useGame } from '../game/GameProvider.jsx';
import Noctaviae from '../art/Noctaviae.jsx';
import Townscape from '../art/Townscape.jsx';

function duration(ms) {
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

export default function Ending({ def, p, onReplay, onCases, onTitle }) {
  const { t, f } = useSettings();
  const { config } = useGame();
  const headRef = useRef(null);
  useEffect(() => headRef.current?.focus(), []);
  const ending = def.endings[p.outcome];
  const breakdown = scoreBreakdown(def, p, config);
  const what = def.final.questions.find((q) => q.id === 'q_what' || q.id === 'q_sync');
  const chosen = what?.options.find((o) => o.id === p.final?.answers?.[what.id]);
  const evidence = def.final.questions.find((q) => q.type === 'evidence');
  const used = (p.final?.answers?.[evidence?.id] ?? []).filter((c) => p.clues.includes(c));
  const facts = (def.facts ?? []).filter((x) => p.clues.includes(x.clue));

  return (
    <main className={`screen ending ending--${def.motif} ending--${p.outcome}`} aria-labelledby="ending-heading">
      <div className="ending__bg" aria-hidden="true">
        <Townscape lit={p.outcome === 'strong'} />
      </div>
      <article className="ending__paper">
        <p className="ending__case">{t(def.title)}</p>
        <h1 id="ending-heading" className="ending__title" tabIndex={-1} ref={headRef}>
          {t(ending.title)}
        </h1>
        <p className={`ending__outcome ending__outcome--${p.outcome}`}>{t(UI[`endOutcome_${p.outcome}`])}</p>
        <p className="ending__text">{t(ending.text)}</p>

        {chosen && (
          <section>
            <h2>{t(UI.endYourConclusion)}</h2>
            <p>{t(chosen.text)}</p>
          </section>
        )}
        {facts.length > 0 && (
          <section>
            <h2>{t(UI.endFacts)}</h2>
            <ul className="ending__facts">
              {facts.map((x) => (
                <li key={x.clue}>{t(x.text)}</li>
              ))}
            </ul>
          </section>
        )}
        {used.length > 0 && (
          <section>
            <h2>{t(UI.endEvidence)}</h2>
            <p className="ending__chips">
              {used.map((c) => (
                <span key={c} className="badge">
                  {t(def.clues[c].title)}
                </span>
              ))}
            </p>
          </section>
        )}
        <section>
          <h2>{t(UI.endUncertain)}</h2>
          <p className="ending__uncertain">{t(def.uncertainty)}</p>
        </section>
        <figure className="ending__cat">
          <Noctaviae />
          <figcaption>
            <strong>{t(UI.endNoctaviae)}</strong> {t(def.noctaviae.ending)}
          </figcaption>
        </figure>
        <section className="ending__score">
          <h2>
            {t(UI.endScore)}: <span className="ending__total">{scoreOf(def, p, config)}</span>
          </h2>
          <dl className="ending__breakdown">
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k}>
                <dt>{t(UI[`score_${k}`])}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="muted">
            {f(UI.endHintsUsed, { n: p.hints.length })} · {f(UI.endTime, { t: duration(p.playMs) })}
          </p>
          <p className="muted">{t(UI.endTimeNote)}</p>
        </section>
        <div className="row ending__actions">
          {onReplay && (
            <button type="button" className="btn btn--primary" onClick={onReplay}>
              {t(UI.endReplay)}
            </button>
          )}
          <button type="button" className="btn btn--secondary" onClick={onCases}>
            {t(UI.endCases)}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onTitle}>
            {t(UI.endTitle)}
          </button>
        </div>
        <p className="muted ending__note">{t(NOCTAVIAE.completed)}</p>
      </article>
    </main>
  );
}
