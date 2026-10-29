import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/im-fell-english/400.css';
import '@fontsource/im-fell-english/400-italic.css';
import '@fontsource/special-elite/400.css';
import '@fontsource-variable/noto-naskh-arabic';
import '@fontsource-variable/reem-kufi';
import './styles/tokens.css';
import './styles/base.css';
import './styles/screens.css';
import './styles/game.css';
import { SettingsProvider } from './core/settings.jsx';
import { GameProvider } from './game/GameProvider.jsx';
import { ToastProvider } from './ui/Toasts.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <GameProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </GameProvider>
    </SettingsProvider>
  </StrictMode>,
);
