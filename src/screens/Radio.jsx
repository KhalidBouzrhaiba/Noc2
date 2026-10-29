import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';
import VintageRadio from '../art/VintageRadio.jsx';

const START_TUNE = 0.08;

/**
 * Case-specific radio announcement. Never depends on sound: every line is shown as text,
 * the player can advance line by line or skip, and timers are cleaned up on unmount.
 */
export default function Radio({ def, onDone }) {
  const { t, reducedMotion } = useSettings();
  const target = (Number(def.radio.freq) - 88) / 20;
  const [phase, setPhase] = useState('off'); // off → tuning → speaking → lost
  const [tune, setTune] = useState(START_TUNE);
  const [line, setLine] = useState(-1);
  const [typed, setTyped] = useState('');
  const done = useRef(false);
  const lines = def.radio.lines;

  const finish = () => {
    if (done.current) return;
    done.current = true;
    audio.play('switch');
    audio.stop('static');
    onDone();
  };

  // Tuning sweep
  useEffect(() => {
    if (phase !== 'tuning') return undefined;
    if (reducedMotion) {
      setTune(target);
      const id = setTimeout(() => setPhase('speaking'), 400);
      return () => clearTimeout(id);
    }
    let raf;
    const t0 = performance.now();
    const dur = 2400;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      // overshoot slightly, then settle on the station
      const eased = START_TUNE + (target - START_TUNE) * (1 - Math.pow(1 - k, 3)) + Math.sin(k * Math.PI * 3) * 0.03 * (1 - k);
      setTune(eased);
      audio.tune(Math.abs(eased - target) * 4);
      if (k < 1) raf = requestAnimationFrame(step);
      else setPhase('speaking');
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, reducedMotion, target]);

  useEffect(() => {
    if (phase === 'speaking') {
      setLine(0);
      audio.setLevel('static', 0.025);
    }
  }, [phase]);

  // Typewriter + auto-advance for each line
  useEffect(() => {
    if (phase !== 'speaking' || line < 0) return undefined;
    if (line >= lines.length) {
      setPhase('lost');
      return undefined;
    }
    const text = t(lines[line]);
    const timers = [];
    if (reducedMotion) setTyped(text);
    else {
      setTyped('');
      let i = 0;
      const tick = () => {
        i += 2;
        setTyped(text.slice(0, i));
        if (i < text.length) timers.push(setTimeout(tick, 28));
      };
      tick();
    }
    timers.push(setTimeout(() => setLine((l) => l + 1), 2200 + text.length * 45));
    return () => timers.forEach(clearTimeout);
  }, [phase, line, lines, t, reducedMotion]);

  useEffect(() => {
    if (phase !== 'lost') return undefined;
    audio.setLevel('static', 0.16);
    const id = setTimeout(finish, reducedMotion ? 600 : 1800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => audio.stop('static'), []);

  const signal = phase === 'off' ? 0 : phase === 'lost' ? 0.1 : Math.max(0, 1 - Math.abs(tune - target) * 6);
  const shown = lines.slice(0, Math.max(0, Math.min(line, lines.length)));

  return (
    <main className={`screen radio radio--${phase} radio--${def.motif}`} aria-labelledby="radio-heading">
      <h1 id="radio-heading" className="sr-only">
        {t(def.title)} — {t(UI.radioTranscript)}
      </h1>
      <div className="radio__room" aria-hidden="true" />
      <div className="radio__set">
        <VintageRadio tune={tune} signal={signal} on={phase !== 'off'} />
        <div className="radio__meter" role="meter" aria-label={t(UI.radioSignal)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(signal * 100)}>
          <span style={{ inlineSize: `${Math.round(signal * 100)}%` }} />
        </div>
        <p className="radio__freq" dir="ltr">
          {phase === 'off' ? '— — . —' : `${(88 + tune * 20).toFixed(1)} MHz`}
        </p>
      </div>

      <section className="radio__transcript" aria-live="polite">
        <h2 className="radio__label">{t(UI.radioTranscript)}</h2>
        {phase === 'off' && <p className="radio__case">{t(def.title)}</p>}
        {phase === 'tuning' && <p className="radio__status">{t(UI.radioTuning)}</p>}
        {shown.map((l, i) => (
          <p key={i} className="radio__line radio__line--past">
            {t(l)}
          </p>
        ))}
        {phase === 'speaking' && line < lines.length && (
          <p className="radio__line radio__line--now">
            {typed}
            <span className="radio__caret" aria-hidden="true" />
          </p>
        )}
        {phase === 'lost' && <p className="radio__status radio__status--lost">{t(UI.radioLost)}</p>}
      </section>

      <div className="radio__actions">
        {phase === 'off' && (
          <button
            type="button"
            className="btn btn--primary btn--lg"
            autoFocus
            onClick={() => {
              audio.unlock();
              audio.play('switch');
              audio.loop('static');
              setPhase('tuning');
            }}
          >
            {t(UI.radioTurnOn)}
          </button>
        )}
        {phase === 'speaking' && (
          <button type="button" className="btn btn--secondary" onClick={() => setLine((l) => l + 1)}>
            {t(UI.radioNext)}
          </button>
        )}
        {phase !== 'lost' && (
          <button type="button" className="btn btn--ghost" onClick={finish}>
            {t(UI.skip)}
          </button>
        )}
      </div>
    </main>
  );
}
