import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';
import { caseById } from '../content/index.js';
import { useGame, resumable } from '../game/GameProvider.jsx';
import { NOCTAVIAE } from '../content/noctaviae.js';
import Townscape from '../art/Townscape.jsx';
import Noctaviae from '../art/Noctaviae.jsx';
import TopControls from '../ui/TopControls.jsx';

export default function Title({ onInvestigate, onContinue, onEvents, eventsAvailable }) {
  const { t, f } = useSettings();
  const { progress } = useGame();
  const resume = resumable(progress);
  const resumeDef = resume ? caseById(resume.id) : null;

  return (
    <main className="screen title" aria-labelledby="title-heading">
      <div className="title__sky" aria-hidden="true" />
      <Townscape className="title__town" />
      <div className="title__top">
        <TopControls />
      </div>
      <div className="title__content">
        <p className="title__town-name">{t(UI.townName)}</p>
        <h1 id="title-heading" className="title__name">
          <span className="title__letters">NOCTAVIAE</span>
        </h1>
        <p className="title__tagline">{t(UI.titleTagline)}</p>
        <div className="title__actions">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              audio.unlock();
              audio.play('click');
              onInvestigate();
            }}
          >
            {t(UI.titleInvestigate)}
          </button>
          {resumeDef && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                audio.unlock();
                onContinue(resume.id);
              }}
            >
              {t(UI.titleContinue)}
              <small>{f(UI.titleContinueCase, { case: t(resumeDef.title) })}</small>
            </button>
          )}
          {eventsAvailable && (
            <button type="button" className="btn btn--ghost" onClick={onEvents}>
              {t(UI.titleEvents)}
            </button>
          )}
        </div>
      </div>
      <figure className="title__cat">
        <Noctaviae className="title__noctaviae" />
        <figcaption className="title__cat-line">{t(NOCTAVIAE.titleLine)}</figcaption>
      </figure>
    </main>
  );
}
