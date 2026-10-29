// Original cathedral-style radio. `tune` 0..1 moves the needle across 88–108 MHz,
// `signal` 0..1 opens the green "magic eye", `on` lights the dial.

const MIN = 88;
const MAX = 108;

export default function VintageRadio({ tune = 0, signal = 0, on = false, className = '' }) {
  const needleX = 150 + tune * 300;
  const knob = tune * 300 - 150;
  const eye = Math.max(0.05, Math.min(1, signal));
  return (
    <svg className={`radio-art ${on ? 'radio-art--on' : ''} ${className}`} viewBox="0 0 600 440" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rd-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b3f22" />
          <stop offset=".5" stopColor="#4a2a17" />
          <stop offset="1" stopColor="#2e190e" />
        </linearGradient>
        <pattern id="rd-grain" width="60" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6c15-4 30 4 60 0" stroke="#000" strokeOpacity=".12" fill="none" />
        </pattern>
        <pattern id="rd-cloth" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#3b2f25" />
          <path d="M0 0l6 6M6 0 0 6" stroke="#55463a" strokeWidth=".8" />
        </pattern>
        <linearGradient id="rd-dial" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={on ? '#f6dc9a' : '#8a7a5c'} />
          <stop offset="1" stopColor={on ? '#e2b25a' : '#6b5d45'} />
        </linearGradient>
        <radialGradient id="rd-eye" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#c8ffb8" />
          <stop offset=".6" stopColor="#4cd16a" />
          <stop offset="1" stopColor="#0f3a1a" />
        </radialGradient>
        <radialGradient id="rd-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {on && <ellipse cx="300" cy="300" rx="300" ry="120" fill="url(#rd-glow)" />}

      {/* cabinet */}
      <path d="M60 420V200C60 90 170 20 300 20s240 70 240 180v220z" fill="url(#rd-wood)" />
      <path d="M60 420V200C60 90 170 20 300 20s240 70 240 180v220z" fill="url(#rd-grain)" />
      <path d="M80 410V204C80 104 180 40 300 40s220 64 220 164v206" fill="none" stroke="#8b5a32" strokeOpacity=".5" strokeWidth="3" />

      {/* grille */}
      <path d="M130 250V200c0-80 76-136 170-136s170 56 170 136v50z" fill="url(#rd-cloth)" />
      <g stroke="#6b3f22" strokeWidth="9" strokeLinecap="round">
        <path d="M300 72v178M240 84v166M360 84v166M185 110v140M415 110v140" />
      </g>

      {/* dial window */}
      <rect x="130" y="266" width="340" height="62" rx="8" fill="#20140c" />
      <rect x="138" y="272" width="324" height="50" rx="5" fill="url(#rd-dial)" />
      <g fill="#3a2410" fontFamily="'Special Elite', monospace" fontSize="11" textAnchor="middle">
        {[88, 92, 96, 100, 104, 108].map((f) => {
          const x = 150 + ((f - MIN) / (MAX - MIN)) * 300;
          return (
            <g key={f}>
              <path d={`M${x} 280v10`} stroke="#3a2410" strokeWidth="1.5" />
              <text x={x} y="306">{f}</text>
            </g>
          );
        })}
        {Array.from({ length: 41 }, (_, i) => 150 + i * 7.5).map((x) => (
          <path key={x} d={`M${x} 280v5`} stroke="#3a2410" strokeWidth=".7" />
        ))}
        <text x="300" y="318" fontSize="8" letterSpacing="2">HOLLOWMERE · MHz</text>
      </g>
      <path className="radio-art__needle" d={`M${needleX} 274v46`} stroke="#b3261e" strokeWidth="2.5" />

      {/* magic eye (signal indicator) */}
      <circle cx="300" cy="360" r="17" fill="#0b0a08" stroke="#8b5a32" strokeWidth="3" />
      <circle cx="300" cy="360" r="12" fill={on ? 'url(#rd-eye)' : '#1c2a1e'} />
      {on && (
        <path
          d={`M300 360L${300 + 12 * Math.sin(Math.PI * (1 - eye))} ${360 - 12 * Math.cos(Math.PI * (1 - eye))}A12 12 0 0 0 ${300 - 12 * Math.sin(Math.PI * (1 - eye))} ${360 - 12 * Math.cos(Math.PI * (1 - eye))}Z`}
          fill="#0b1a0e"
        />
      )}

      {/* knobs */}
      {[150, 450].map((kx, i) => (
        <g key={kx} transform={`rotate(${i === 1 ? knob : knob / 3} ${kx} 372)`}>
          <circle cx={kx} cy="372" r="30" fill="#2a1a10" />
          <circle cx={kx} cy="372" r="24" fill="#d8c6a0" />
          <circle cx={kx} cy="372" r="18" fill="#bfa77a" />
          <path d={`M${kx} 352v14`} stroke="#3a2410" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="300" cy="404" r="4" fill={on ? '#ff6b3d' : '#3b231a'} className="radio-art__power" />
    </svg>
  );
}
