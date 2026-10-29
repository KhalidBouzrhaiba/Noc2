import { useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';
import { CASES } from '../content/index.js';
import { useGame, caseStatus } from '../game/GameProvider.jsx';
import Modal from '../ui/Modal.jsx';
import TopControls from '../ui/TopControls.jsx';
import { CaseMotif } from '../art/CaseMotifs.jsx';

const STATUS_LABEL = { new: UI.caseNew, inProgress: UI.caseInProgress, completed: UI.caseCompleted, unreadable: UI.saveUnreadable };

export default function CaseSelect({ onStart, onBack }) {
  const { t, f } = useSettings();
  const { progress, discardCase } = useGame();
  const [selected, setSelected] = useState(null);
  const [confirmReplay, setConfirmReplay] = useState(null);
  const busy = useRef(false);

  // One click starts exactly one case: further clicks are ignored until the screen changes.
  const start = (id, mode) => {
    if (busy.current) return;
    busy.current = true;
    audio.unlock();
    audio.play('paper');
    onStart(id, mode);
  };

  return (
    <main className="screen cases" aria-labelledby="cases-heading">
      <header className="cases__head">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          <span aria-hidden="true" className="flip-rtl">←</span> {t(UI.back)}
        </button>
        <TopControls compact />
      </header>
      <h1 id="cases-heading" className="cases__title">{t(UI.casesTitle)}</h1>
      <p className="cases__subtitle">{t(UI.casesSubtitle)}</p>

      <ul className="cases__desk">
        {CASES.map((def) => {
          const entry = progress[def.id];
          const status = caseStatus(entry);
          const isSel = selected === def.id;
          return (
            <li key={def.id} className={`file file--${def.motif} ${isSel ? 'is-open' : ''}`}>
              <button
                type="button"
                className="file__cover"
                aria-expanded={isSel}
                aria-controls={`file-${def.id}`}
                onClick={() => {
                  audio.play('paper');
                  setSelected(isSel ? null : def.id);
                }}
              >
                <span className="file__tab">{f(UI.caseFileNo, { n: def.num })}</span>
                <CaseMotif motif={def.motif} />
                <span className="file__title">{t(def.title)}</span>
                <span className={`stamp stamp--${status}`}>{t(STATUS_LABEL[status])}</span>
              </button>
              <div className="file__inside" id={`file-${def.id}`} hidden={!isSel}>
                <p className="file__teaser">{t(def.teaser)}</p>
                {entry?.p?.best && <p className="file__best">{f(UI.caseBestScore, { score: entry.p.best.score })}</p>}
                <div className="file__actions">
                  {status === 'new' && (
                    <button type="button" className="btn btn--primary" onClick={() => start(def.id, 'new')}>
                      {t(UI.caseBegin)}
                    </button>
                  )}
                  {status === 'inProgress' && (
                    <>
                      <button type="button" className="btn btn--primary" onClick={() => start(def.id, 'resume')}>
                        {t(UI.caseResume)}
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={() => setConfirmReplay(def.id)}>
                        {t(UI.caseReplay)}
                      </button>
                    </>
                  )}
                  {status === 'completed' && (
                    <button type="button" className="btn btn--primary" onClick={() => setConfirmReplay(def.id)}>
                      {t(UI.caseReplay)}
                    </button>
                  )}
                  {status === 'unreadable' && (
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => {
                        discardCase(def.id);
                      }}
                    >
                      {t(UI.saveUnreadableAction)}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal open={!!confirmReplay} onClose={() => setConfirmReplay(null)} title={t(UI.replayTitle)} className="confirm">
        <p>{t(UI.replayBody)}</p>
        <div className="row">
          <button type="button" className="btn btn--ghost" onClick={() => setConfirmReplay(null)}>
            {t(UI.cancel)}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              const id = confirmReplay;
              setConfirmReplay(null);
              start(id, 'replay');
            }}
          >
            {t(UI.caseReplay)}
          </button>
        </div>
      </Modal>
    </main>
  );
}
