import { useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';

/** The final scene: the player assembles a conclusion from evidence they actually hold. */
export default function FinalDeduction({ def, p, onSubmit }) {
  const { t, f } = useSettings();
  const [answers, setAnswers] = useState(() => {
    const a = {};
    for (const q of def.final.questions) a[q.id] = q.type === 'order' ? [...q.shuffled] : q.type === 'evidence' ? [] : null;
    return a;
  });
  const [grade, setGrade] = useState(null);
  const [empty, setEmpty] = useState(false);
  const busy = useRef(false);
  const set = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const r = onSubmit(answers);
    busy.current = false;
    setEmpty(r.code === 'empty');
    if (r.grade) setGrade(r.grade);
  };

  const fb = (id) => grade?.feedback?.[id];

  return (
    <form className="final" onSubmit={submit} noValidate>
      <p className="final__intro">{t(UI.finalIntro)}</p>
      {def.final.questions.map((q, qi) => (
        <fieldset key={q.id} className={`final__q ${fb(q.id) ? (fb(q.id).ok ? 'is-ok' : 'is-bad') : ''}`}>
          <legend>
            <span className="final__n">{qi + 1}</span> {t(q.prompt)}
          </legend>
          {q.type === 'choice' &&
            q.options.map((o) => (
              <label key={o.id} className="option">
                <input type="radio" name={q.id} checked={answers[q.id] === o.id} onChange={() => set(q.id, o.id)} />
                <span>{t(o.text)}</span>
              </label>
            ))}
          {q.type === 'order' && (
            <ol className="order">
              {answers[q.id].map((id, i) => (
                <li key={id} className="order__row">
                  <span className="order__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="order__text">{t(q.items[id])}</span>
                  <span className="order__btns">
                    {[-1, 1].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className="icon-btn"
                        disabled={i + d < 0 || i + d >= answers[q.id].length}
                        aria-label={f(d < 0 ? UI.puzzleMoveUp : UI.puzzleMoveDown, { item: t(q.items[id]) })}
                        onClick={() => {
                          const next = [...answers[q.id]];
                          [next[i], next[i + d]] = [next[i + d], next[i]];
                          set(q.id, next);
                        }}
                      >
                        {d < 0 ? '▲' : '▼'}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          )}
          {q.type === 'evidence' && (
            <>
              <p className="muted">{t(UI.finalPickEvidence)}</p>
              <div className="final__evidence">
                {p.clues.map((c) => (
                  <label key={c} className="check">
                    <input
                      type="checkbox"
                      checked={answers[q.id].includes(c)}
                      onChange={(e) => set(q.id, e.target.checked ? [...answers[q.id], c] : answers[q.id].filter((x) => x !== c))}
                    />
                    <span>
                      {t(def.clues[c].title)} <small className={`card__status card__status--${def.clues[c].status}`}>{t(UI[`status_${def.clues[c].status}`])}</small>
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
          {fb(q.id) && (
            <p className={`feedback ${fb(q.id).ok ? 'feedback--ok' : 'feedback--wrong'}`}>
              {t(fb(q.id).ok ? UI.finalSupported : UI.finalNotSupported)}
              {q.type === 'evidence' && fb(q.id).missing > 0 && <> — {f(UI.finalEvidenceMissing, { n: fb(q.id).missing })}</>}
              {q.type === 'evidence' && fb(q.id).weak > 0 && <> — {f(UI.finalEvidenceWeak, { n: fb(q.id).weak })}</>}
            </p>
          )}
        </fieldset>
      ))}
      {grade?.feedback?.board && !grade.feedback.board.ok && <p className="feedback feedback--warn">{f(UI.finalBoardMissing, { n: grade.feedback.board.missing })}</p>}
      {grade?.outcome === 'incomplete' && (
        <p className="feedback feedback--wrong" role="alert">
          {t(UI.finalIncomplete)}
        </p>
      )}
      {empty && <p className="feedback feedback--warn">{t(UI.puzzleEmpty)}</p>}
      <p className="muted">{t(UI.finalWarn)}</p>
      <button type="submit" className="btn btn--primary btn--lg">
        {t(UI.finalSubmit)}
      </button>
    </form>
  );
}
