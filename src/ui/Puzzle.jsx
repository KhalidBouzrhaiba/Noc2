import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';

/**
 * Data-driven puzzle UI. It never decides correctness: it sends the answer to the engine via
 * `onSubmit(answer)` and shows the engine's verdict.
 */
export default function Puzzle({ pz, solved, attempts, onSubmit }) {
  const { t, f } = useSettings();
  const [answer, setAnswer] = useState(() => initialAnswer(pz));
  const [verdict, setVerdict] = useState(null);
  const pending = useRef(false);

  useEffect(() => {
    setAnswer(initialAnswer(pz));
    setVerdict(null);
  }, [pz]);

  const submit = (e) => {
    e.preventDefault();
    if (pending.current || solved) return;
    pending.current = true;
    const r = onSubmit(answer);
    pending.current = false;
    setVerdict(r);
  };

  const feedback = () => {
    if (!verdict) return null;
    if (verdict.code === 'empty') return <p className="feedback feedback--warn">{t(UI.puzzleEmpty)}</p>;
    if (verdict.code === 'wrong')
      return (
        <div className="feedback feedback--wrong" role="alert">
          <p>{t(verdict.msg)}</p>
          {verdict.detail?.total != null && (
            <p className="muted">{f(pz.type === 'order' ? UI.puzzleOrderDetail : UI.puzzleMatchDetail, verdict.detail)}</p>
          )}
        </div>
      );
    if (verdict.ok) return <p className="feedback feedback--ok" role="status">{t(verdict.msg ?? pz.success)}</p>;
    return <p className="feedback feedback--warn">{t(UI.msgLocked)}</p>;
  };

  return (
    <form className={`puzzle puzzle--${pz.type}`} onSubmit={submit} noValidate>
      <p className="puzzle__prompt">{t(pz.prompt)}</p>
      {solved ? (
        <p className="feedback feedback--ok">{t(UI.puzzleSolvedNote)} {t(pz.success)}</p>
      ) : (
        <>
          <Body pz={pz} answer={answer} setAnswer={setAnswer} />
          <div className="puzzle__foot">
            {attempts > 0 && <span className="muted">{f(UI.puzzleAttempts, { n: attempts })}</span>}
            <button type="submit" className="btn btn--primary">
              {t(UI.puzzleSubmit)}
            </button>
          </div>
          {feedback()}
        </>
      )}
    </form>
  );
}

function initialAnswer(pz) {
  if (pz.type === 'order') return [...pz.shuffled];
  if (pz.type === 'multi') return [];
  if (pz.type === 'classify' || pz.type === 'match') return {};
  return '';
}

function Body({ pz, answer, setAnswer }) {
  const { t, f, dir } = useSettings();
  switch (pz.type) {
    case 'choice':
      return (
        <fieldset className="options">
          <legend className="sr-only">{t(pz.title)}</legend>
          {pz.options.map((o) => (
            <label key={o.id} className="option">
              <input type="radio" name={pz.id} value={o.id} checked={answer === o.id} onChange={() => setAnswer(o.id)} />
              <span>{t(o.text)}</span>
            </label>
          ))}
        </fieldset>
      );
    case 'order': {
      const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= answer.length) return;
        const next = [...answer];
        [next[i], next[j]] = [next[j], next[i]];
        setAnswer(next);
      };
      return (
        <ol className="order">
          {answer.map((id, i) => (
            <li key={id} className="order__row">
              <span className="order__n" aria-hidden="true">
                {i + 1}
              </span>
              <span className="order__text">{t(pz.items[id])}</span>
              <span className="order__btns">
                <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={f(UI.puzzleMoveUp, { item: t(pz.items[id]) })}>
                  ▲
                </button>
                <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === answer.length - 1} aria-label={f(UI.puzzleMoveDown, { item: t(pz.items[id]) })}>
                  ▼
                </button>
              </span>
            </li>
          ))}
        </ol>
      );
    }
    case 'code':
      return (
        <div className="code">
          <label className="code__label">
            <span>{t(UI.puzzleCodeLabel)}</span>
            <input
              className="code__input"
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              maxLength={pz.digits}
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/[^0-9٠-٩]/g, '').slice(0, pz.digits))}
            />
          </label>
          <div className="keypad" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                type="button"
                className="keypad__key"
                aria-label={k === 'C' ? t(UI.puzzleClear) : k === '⌫' ? 'Backspace' : k}
                onClick={() => {
                  if (k === 'C') setAnswer('');
                  else if (k === '⌫') setAnswer((a) => a.slice(0, -1));
                  else setAnswer((a) => (a.length < pz.digits ? a + k : a));
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      );
    case 'word':
      return (
        <label className="word">
          <span>{t(UI.puzzleWordLabel)}</span>
          <input className="word__input" dir="auto" autoComplete="off" autoCapitalize="none" spellCheck="false" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </label>
      );
    case 'classify':
      return (
        <div className="classify">
          {Object.entries(pz.statements).map(([sid, text]) => (
            <fieldset key={sid} className="classify__row">
              <legend>{t(text)}</legend>
              <div className="seg">
                {Object.entries(pz.categories).map(([cid, label]) => (
                  <label key={cid} className="seg__opt">
                    <input type="radio" name={`${pz.id}-${sid}`} checked={answer[sid] === cid} onChange={() => setAnswer({ ...answer, [sid]: cid })} />
                    <span>{t(label)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      );
    case 'match':
      return (
        <div className="match">
          {Object.entries(pz.left).map(([lid, text]) => (
            <label key={lid} className="match__row">
              <span>{t(text)}</span>
              <select dir={dir} value={answer[lid] ?? ''} onChange={(e) => setAnswer({ ...answer, [lid]: e.target.value })}>
                <option value="">{t(UI.puzzleChoose)}</option>
                {Object.entries(pz.right).map(([rid, rtext]) => (
                  <option key={rid} value={rid}>
                    {t(rtext)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
}
