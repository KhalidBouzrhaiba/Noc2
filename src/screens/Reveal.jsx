import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';
import { NOCTAVIAE } from '../content/noctaviae.js';
import { activeObjectives } from '../game/engine.js';
import Townscape from '../art/Townscape.jsx';
import Noctaviae from '../art/Noctaviae.jsx';

/** Blackout (signal failure) followed by the reveal of Hollowmere, then entry into play. */
export default function Reveal({ def, progress, onEnter }) {
  const { t, reducedMotion } = useSettings();
  const [phase, setPhase] = useState('blackout');
  const entered = useRef(false);
  const objective = activeObjectives(def, progress)[0];
  const enterRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setPhase('reveal');
      audio.loop('wind', 0.8);
    }, reducedMotion ? 350 : 1600);
    return () => clearTimeout(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (phase === 'reveal') enterRef.current?.focus();
  }, [phase]);

  const enter = () => {
    if (entered.current) return;
    entered.current = true;
    onEnter();
  };

  return (
    <main className={`screen reveal reveal--${phase}`} aria-labelledby="reveal-heading">
      <div className="reveal__black" aria-hidden="true">
        <span className="reveal__scan" />
      </div>
      <div className="reveal__sky" aria-hidden="true" />
      <Townscape className="reveal__town" />
      <div className="reveal__cat" aria-hidden="true">
        <Noctaviae />
      </div>
      <div className="reveal__text" hidden={phase !== 'reveal'}>
        <p className="reveal__welcome">{t(UI.revealWelcome)}</p>
        <h1 id="reveal-heading" className="reveal__town-name">
          {t(UI.townName)}
        </h1>
        <p className="reveal__case">{t(def.title)}</p>
        <p className="reveal__line">{t(def.reveal)}</p>
        {objective && (
          <p className="reveal__objective">
            <span>{t(UI.revealObjective)}</span> {t(objective.text)}
          </p>
        )}
        <p className="reveal__noctaviae">— {t(NOCTAVIAE.revealLine)}</p>
        <button ref={enterRef} type="button" className="btn btn--primary btn--lg" onClick={enter}>
          {t(UI.revealEnter)}
        </button>
      </div>
    </main>
  );
}
