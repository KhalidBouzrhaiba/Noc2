import { Component, useCallback, useEffect, useState } from 'react';
import { useSettings } from './core/settings.jsx';
import { UI } from './core/locales/ui.js';
import { audio } from './core/audio.js';
import { caseById } from './content/index.js';
import { useGame } from './game/GameProvider.jsx';
import Title from './screens/Title.jsx';
import CaseSelect from './screens/CaseSelect.jsx';
import Radio from './screens/Radio.jsx';
import Reveal from './screens/Reveal.jsx';
import Game from './screens/Game.jsx';
import Ending from './screens/Ending.jsx';

/**
 * Opening order (fixed): title → case selection → radio → blackout → town reveal → play.
 * Resuming an in-progress case goes straight back to play.
 */
export default function App() {
  const { progress, startCase } = useGame();
  const [screen, setScreen] = useState('title');
  const [caseId, setCaseId] = useState(null);
  const def = caseId ? caseById(caseId) : null;
  const p = caseId ? progress[caseId]?.p : null;

  useEffect(() => {
    document.documentElement.dataset.screen = screen;
    window.scrollTo(0, 0);
  }, [screen]);

  const start = useCallback(
    (id, mode) => {
      startCase(id, mode); // the active case is stored before the radio begins
      setCaseId(id);
      setScreen(mode === 'resume' ? 'play' : 'radio');
    },
    [startCase],
  );

  const toEnding = useCallback(() => setScreen('ending'), []);
  const exit = useCallback((to) => {
    audio.stopAll();
    setScreen(to);
  }, []);

  let view;
  if (screen === 'title' || !def || !p)
    view = <Title onInvestigate={() => setScreen('cases')} onContinue={(id) => start(id, 'resume')} />;
  else if (screen === 'cases') view = <CaseSelect onStart={start} onBack={() => setScreen('title')} />;
  else if (screen === 'radio') view = <Radio key={`${caseId}-${p.run}`} def={def} onDone={() => setScreen('reveal')} />;
  else if (screen === 'reveal') view = <Reveal def={def} progress={p} onEnter={() => setScreen('play')} />;
  else if (screen === 'ending' && p.completed)
    view = <Ending def={def} p={p} onReplay={() => start(caseId, 'replay')} onCases={() => exit('cases')} onTitle={() => exit('title')} />;
  else view = <Game key={`${caseId}-${p.run}`} caseId={caseId} onEnding={toEnding} onExit={exit} />;

  // The case-selection screen must be reachable without an active case.
  if (screen === 'cases' && (!def || !p)) view = <CaseSelect onStart={start} onBack={() => setScreen('title')} />;

  return <ErrorBoundary onReset={() => setScreen('title')}>{view}</ErrorBoundary>;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error('[noctaviae] screen crashed:', error);
  }
  render() {
    if (this.state.error)
      return (
        <Crash
          onReset={() => {
            this.setState({ error: null });
            this.props.onReset();
          }}
        />
      );
    return this.props.children;
  }
}

function Crash({ onReset }) {
  const { t } = useSettings();
  return (
    <main className="screen crash">
      <h1>{t(UI.crashTitle)}</h1>
      <p>{t(UI.crashBody)}</p>
      <button type="button" className="btn btn--primary" onClick={onReset}>
        {t(UI.menuToTitle)}
      </button>
    </main>
  );
}
