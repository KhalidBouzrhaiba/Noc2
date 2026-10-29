import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';
import { caseById } from '../content/index.js';
import { useGame } from '../game/GameProvider.jsx';
import { check } from '../game/conditions.js';
import { activeObjectives, hintBalance, locationById, objectById, objectText, puzzleAvailable, scoreOf } from '../game/engine.js';
import { useToasts } from '../ui/Toasts.jsx';
import Modal from '../ui/Modal.jsx';
import Scene from '../ui/Scene.jsx';
import DocView from '../ui/DocView.jsx';
import Puzzle from '../ui/Puzzle.jsx';
import Notebook from '../ui/Notebook.jsx';
import Inventory from '../ui/Inventory.jsx';
import MapView from '../ui/MapView.jsx';
import HintScene from '../ui/HintScene.jsx';
import FinalDeduction from '../ui/FinalDeduction.jsx';
import TopControls from '../ui/TopControls.jsx';
import { Prop } from '../art/props.jsx';
import { ItemIcon } from '../art/ItemIcons.jsx';
import Noctaviae from '../art/Noctaviae.jsx';

const OUTDOOR = new Set(['tower', 'square', 'garden', 'street']);

/** Turns an engine result into toasts and sound cues. */
function useFeedback(def) {
  const { t, f } = useSettings();
  const { push } = useToasts();
  return useCallback(
    (r) => {
      if (!r) return;
      const g = r.gained ?? {};
      g.clues?.forEach((c) => push(f(UI.toastClue, { title: t(def.clues[c].title) }), 'clue', `clue:${c}`));
      g.items?.forEach((i) => push(f(UI.toastItem, { name: t(def.items[i].name) }), 'item', `item:${i}`));
      g.unlocked?.forEach((l) => push(f(UI.toastUnlocked, { name: t(locationById(def, l).name) }), 'unlock', `loc:${l}`));
      g.solved?.forEach((s) => push(t(UI.toastSolved), 'solve', `solve:${s}`));
      g.deductions?.forEach((d) => push(t(UI.toastDeduction), 'solve', `ded:${d}`));
      if (r.saved === false) push(t(UI.toastSaveFailed), 'error', 'save-failed');
      if (g.solved?.length || g.deductions?.length) audio.play('solve');
      else if (g.unlocked?.length) audio.play('unlock');
      else if (g.items?.length) audio.play('item');
      else if (g.clues?.length) audio.play('discover');
      else if (r.code === 'wrong' || r.code === 'incompatible' || r.code === 'no_link') audio.play('wrong');
    },
    [def, push, t, f],
  );
}

export default function Game({ caseId, onEnding, onExit }) {
  const { t, f } = useSettings();
  const { progress, dispatch, config, storageAvailable } = useGame();
  const { push } = useToasts();
  const def = caseById(caseId);
  const p = progress[caseId]?.p;
  const [overlay, setOverlay] = useState(null);
  const [using, setUsing] = useState(null);
  const feedback = useFeedback(def);
  const titleRef = useRef(null);

  const run = useCallback(
    (action) => {
      const r = dispatch(caseId, action);
      feedback(r);
      return r;
    },
    [caseId, dispatch, feedback],
  );

  // Arriving in a location counts as a visit (first visit of the start location included).
  useEffect(() => {
    if (p && !p.visited.includes(p.loc)) run({ type: 'visit', loc: p.loc });
    if (!storageAvailable) push(t(UI.toastNoStorage), 'error', 'no-storage');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Active play time (only while the tab is visible).
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') dispatch(caseId, { type: 'time', ms: 15000 });
    }, 15000);
    return () => clearInterval(id);
  }, [caseId, dispatch]);

  // Ambient bed per environment.
  const scene = p ? locationById(def, p.loc).scene : null;
  useEffect(() => {
    if (!scene) return;
    if (OUTDOOR.has(scene)) {
      audio.stop('room');
      audio.loop('wind', 0.8);
    } else {
      audio.stop('wind');
      audio.loop('room');
    }
  }, [scene]);
  useEffect(() => () => {
    audio.stop('wind');
    audio.stop('room');
  }, []);

  useEffect(() => {
    if (p?.completed) onEnding();
  }, [p?.completed, onEnding]);

  if (!p) return null;

  const objectives = activeObjectives(def, p);
  const finalReady = check(def.final.requires, p);
  const close = () => setOverlay(null);

  const onObject = (o) => {
    if (using) {
      const r = run({ type: 'use', item: using, obj: o.id });
      setUsing(null);
      setOverlay({ type: 'object', obj: o.id, result: r });
      return;
    }
    audio.play('click');
    const r = run({ type: 'interact', obj: o.id });
    if (r.open?.doc && r.gained.clues.length) audio.play('paper');
    setOverlay({ type: 'object', obj: o.id, result: r });
  };

  const travel = (loc) => {
    const r = run({ type: 'visit', loc });
    if (r.ok) {
      setOverlay(null);
      setTimeout(() => titleRef.current?.focus(), 30);
    }
  };

  return (
    <main className={`screen game game--${def.motif}`} aria-labelledby="game-loc">
      <header className="hud">
        <button type="button" className="hud__menu btn btn--ghost" onClick={() => setOverlay({ type: 'menu' })} aria-haspopup="dialog">
          <span aria-hidden="true">☰</span> <span className="hud__menu-label">{t(UI.menu)}</span>
        </button>
        <div className="hud__where">
          <p className="hud__case">{t(def.title)}</p>
          <h1 id="game-loc" className="hud__loc" tabIndex={-1} ref={titleRef}>
            {t(locationById(def, p.loc).name)}
          </h1>
        </div>
        <dl className="hud__stats">
          <div>
            <dt>{t(UI.hudScore)}</dt>
            <dd>{scoreOf(def, p, config)}</dd>
          </div>
          <div>
            <dt>{t(UI.hudHints)}</dt>
            <dd>{hintBalance(def, p, config)}</dd>
          </div>
        </dl>
      </header>

      <details className="objectives" open>
        <summary>
          {t(objectives.length > 1 ? UI.hudObjectives : UI.hudObjective)}
          <span className="objectives__count">{objectives.length}</span>
        </summary>
        <ul>
          {objectives.slice(0, 3).map((o) => (
            <li key={o.id}>{t(o.text)}</li>
          ))}
        </ul>
      </details>

      {using && (
        <div className="using" role="status">
          <ItemIcon icon={def.items[using].icon} />
          <span>{f(UI.usingBanner, { item: t(def.items[using].name) })}</span>
          <button type="button" className="btn btn--ghost" onClick={() => setUsing(null)}>
            {t(UI.usingCancel)}
          </button>
        </div>
      )}

      <Scene def={def} p={p} onObject={onObject} usingItem={using} />

      <nav className="dock" aria-label={t(UI.menu)}>
        <button type="button" className="dock__btn" onClick={() => setOverlay({ type: 'map' })}>
          <DockIcon name="map" />
          <span>{t(UI.navMap)}</span>
        </button>
        <button type="button" className="dock__btn" onClick={() => setOverlay({ type: 'notebook' })}>
          <DockIcon name="notebook" />
          <span>{t(UI.navNotebook)}</span>
          <span className="dock__count">{p.clues.length}</span>
        </button>
        <button type="button" className="dock__btn" onClick={() => setOverlay({ type: 'inventory' })}>
          <DockIcon name="bag" />
          <span>{t(UI.navInventory)}</span>
          <span className="dock__count">{p.items.filter((i) => !p.used.includes(i)).length}</span>
        </button>
        <button type="button" className="dock__btn dock__btn--cat" onClick={() => setOverlay({ type: 'hints' })}>
          <Noctaviae className="dock__cat" rim={false} />
          <span>{t(UI.navNoctaviae)}</span>
        </button>
        {finalReady && (
          <button type="button" className="dock__btn dock__btn--final" onClick={() => setOverlay({ type: 'final' })}>
            <DockIcon name="seal" />
            <span>{t(UI.navConclude)}</span>
          </button>
        )}
      </nav>

      {/* ── Overlays */}
      <Modal open={overlay?.type === 'object'} onClose={close} title={overlay?.obj ? t(objectById(def, overlay.obj).name) : ''} className="objpanel">
        {overlay?.type === 'object' && (
          <ObjectPanel
            def={def}
            p={p}
            objId={overlay.obj}
            result={overlay.result}
            onDoc={(clue) => setOverlay({ type: 'doc', clue, back: overlay })}
            onPuzzle={(id) => setOverlay({ type: 'puzzle', id })}
            onUse={(item) => {
              const r = run({ type: 'use', item, obj: overlay.obj });
              setOverlay({ type: 'object', obj: overlay.obj, result: r });
            }}
          />
        )}
      </Modal>

      <Modal open={overlay?.type === 'doc'} onClose={() => setOverlay(overlay?.back ?? null)} title={overlay?.clue ? t(def.clues[overlay.clue].title) : ''} className="docpanel">
        {overlay?.type === 'doc' && <DocView def={def} clueId={overlay.clue} />}
      </Modal>

      <Modal open={overlay?.type === 'puzzle'} onClose={close} title={overlay?.id ? t(def.puzzles[overlay.id].title) : ''} className="puzzlepanel" wide>
        {overlay?.type === 'puzzle' && (
          <Puzzle
            pz={def.puzzles[overlay.id]}
            solved={p.solved.includes(overlay.id)}
            attempts={p.attempts[overlay.id] ?? 0}
            onSubmit={(answer) => run({ type: 'solve', puzzle: overlay.id, answer })}
          />
        )}
      </Modal>

      <Modal open={overlay?.type === 'notebook'} onClose={close} title={t(UI.navNotebook)} wide className="nbpanel">
        {overlay?.type === 'notebook' && <Notebook def={def} p={p} onConnect={(a, b) => run({ type: 'connect', a, b })} />}
        {overlay?.type === 'notebook' && finalReady && (
          <button type="button" className="btn btn--primary nb__conclude" onClick={() => setOverlay({ type: 'final' })}>
            {t(UI.navConclude)}
          </button>
        )}
      </Modal>

      <Modal open={overlay?.type === 'inventory'} onClose={close} title={t(UI.navInventory)}>
        {overlay?.type === 'inventory' && (
          <Inventory
            def={def}
            p={p}
            onUse={(item) => {
              setUsing(item);
              close();
            }}
          />
        )}
      </Modal>

      <Modal open={overlay?.type === 'map'} onClose={close} title={t(UI.mapTitle)} wide className="mappanel">
        {overlay?.type === 'map' && <MapView def={def} p={p} onTravel={travel} />}
      </Modal>

      <Modal open={overlay?.type === 'hints'} onClose={close} title={t(UI.hintTitle)} wide className="hintpanel">
        {overlay?.type === 'hints' && <HintScene def={def} p={p} cfg={config} onBuy={(puzzle, level, tx) => run({ type: 'hint', puzzle, level, tx })} />}
      </Modal>

      <Modal open={overlay?.type === 'final'} onClose={close} title={t(UI.finalTitle)} wide className="finalpanel">
        {overlay?.type === 'final' &&
          (finalReady ? <FinalDeduction def={def} p={p} onSubmit={(answers) => run({ type: 'final', answers })} /> : <p>{t(UI.finalLocked)}</p>)}
      </Modal>

      <Modal open={overlay?.type === 'menu'} onClose={close} title={t(UI.menuTitle)} className="menupanel">
        {overlay?.type === 'menu' && (
          <div className="menu">
            <button type="button" className="btn btn--primary" onClick={close}>
              {t(UI.menuResume)}
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => onExit('cases')}>
              {t(UI.menuToCases)}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => onExit('title')}>
              {t(UI.menuToTitle)}
            </button>
            <TopControls />
            <p className="muted">{t(storageAvailable ? UI.menuSaved : UI.toastNoStorage)}</p>
            <p className="muted">{t(UI.menuLocalNote)}</p>
          </div>
        )}
      </Modal>
    </main>
  );
}

function ObjectPanel({ def, p, objId, result, onDoc, onPuzzle, onUse }) {
  const { t, f } = useSettings();
  const o = objectById(def, objId);
  const r = result ?? {};
  const lockedMsg = r.code === 'locked' ? r.msg ?? UI.msgLocked : null;
  const useMsg =
    r.code === 'incompatible' ? r.msg ?? UI.msgIncompatible : r.code === 'already_done' ? UI.msgAlreadyDone : r.code === 'no_item' ? UI.noItems : r.ok && r.msg ? r.msg : null;
  const docClue = o.doc && p.clues.includes(o.doc) ? o.doc : null;
  const puzzleOpen = o.puzzle && puzzleAvailable(def, p, o.puzzle) && check(o.requires, p);
  const usable = p.items.filter((i) => !p.used.includes(i));
  return (
    <div className="objpanel__body">
      <div className="objpanel__art" aria-hidden="true">
        <Prop name={o.prop} />
      </div>
      <div className="objpanel__text">
        <p className="objpanel__desc">{t(objectText(o, p))}</p>
        {lockedMsg && (
          <p className="feedback feedback--warn" role="status">
            {t(lockedMsg)}
          </p>
        )}
        {useMsg && (
          <p className={`feedback ${r.ok ? 'feedback--ok' : 'feedback--wrong'}`} role="status">
            {t(useMsg)}
          </p>
        )}
        {(r.gained?.clues?.length > 0 || r.gained?.items?.length > 0) && (
          <ul className="gains">
            {r.gained.clues.map((c) => (
              <li key={c}>{f(UI.toastClue, { title: t(def.clues[c].title) })}</li>
            ))}
            {r.gained.items.map((i) => (
              <li key={i}>{f(UI.toastItem, { name: t(def.items[i].name) })}</li>
            ))}
            {r.gained.unlocked.map((l) => (
              <li key={l}>{f(UI.toastUnlocked, { name: t(locationById(def, l).name) })}</li>
            ))}
          </ul>
        )}
        <div className="objpanel__actions">
          {docClue && (
            <button type="button" className="btn btn--primary" onClick={() => onDoc(docClue)} autoFocus>
              {t(UI.actionRead)}
            </button>
          )}
          {puzzleOpen && (
            <button type="button" className="btn btn--primary" onClick={() => onPuzzle(o.puzzle)} autoFocus={!docClue}>
              {t(UI.actionPuzzle)}
            </button>
          )}
        </div>
        {usable.length > 0 && (
          <details className="objpanel__use">
            <summary>{t(UI.actionUse)}</summary>
            <div className="row">
              {usable.map((i) => (
                <button key={i} type="button" className="btn btn--secondary" onClick={() => onUse(i)}>
                  <ItemIcon icon={def.items[i].icon} /> {f(UI.actionUseItem, { item: t(def.items[i].name) })}
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function DockIcon({ name }) {
  const paths = {
    map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
    notebook: 'M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM6 3v18M9 8h7M9 12h7',
    bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
    seal: 'M12 3l2.5 4.5L19 9l-3.5 3.5L16 18l-4-2-4 2 .5-5.5L5 9l4.5-1.5z',
  };
  return (
    <svg className="dock__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
