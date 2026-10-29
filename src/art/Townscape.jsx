// Hollowmere at night: an original layered SVG skyline used on the title screen, the reveal
// and the town map. Windows carry `--i` so the reveal can light them one by one.

const FAR = [
  // x, width, height, roof type
  [0, 120, 150, 'gable'], [110, 90, 120, 'flat'], [190, 140, 175, 'gable'], [320, 80, 135, 'crooked'],
  [700, 110, 140, 'gable'], [800, 90, 165, 'crooked'], [880, 130, 130, 'flat'], [1180, 100, 150, 'gable'],
  [1270, 120, 120, 'crooked'], [1380, 110, 160, 'gable'], [1480, 120, 135, 'flat'],
];

const NEAR = [
  [-20, 170, 210, 'gable', [[30, 80], [90, 80], [30, 140]]],
  [140, 130, 180, 'crooked', [[30, 70], [80, 120]]],
  [260, 190, 240, 'gable', [[30, 90], [110, 90], [70, 160]]],
  [440, 150, 190, 'flat', [[25, 70], [90, 70]]],
  [580, 140, 220, 'crooked', [[30, 90], [85, 150]]],
  [1000, 170, 200, 'gable', [[30, 80], [110, 80], [70, 140]]],
  [1160, 140, 240, 'crooked', [[30, 90], [80, 160]]],
  [1290, 180, 190, 'gable', [[40, 80], [120, 80]]],
  [1460, 170, 220, 'flat', [[30, 80], [100, 80], [60, 150]]],
];

function roof(x, w, h, type, base) {
  const top = base - h;
  if (type === 'gable') return `M${x} ${base}V${top + 30}L${x + w / 2} ${top - 28}L${x + w} ${top + 30}V${base}Z`;
  if (type === 'crooked') return `M${x} ${base}V${top + 18}L${x + w * 0.35} ${top - 34}L${x + w} ${top + 6}V${base}Z`;
  return `M${x} ${base}V${top}H${x + w}V${base}Z`;
}

export default function Townscape({ className = '', lit = true, windows = true }) {
  let wi = 0;
  return (
    <svg className={`townscape ${className}`} viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ts-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a95a3" stopOpacity="0" />
          <stop offset="1" stopColor="#9a95a3" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id="ts-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1a20" />
          <stop offset="1" stopColor="#0c0b0f" />
        </linearGradient>
        <radialGradient id="ts-lamp" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffc35c" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffc35c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* moon behind cloud */}
      <g className="townscape__moon">
        <circle cx="1250" cy="120" r="46" fill="#e9e1cc" opacity=".85" />
        <circle cx="1268" cy="110" r="44" fill="#2a2633" opacity=".92" />
        <path d="M1150 150c40-18 120-22 190-6 30 7 60 4 80-4-20 22-70 30-120 26-60-6-110-2-150-16z" fill="#3b3644" opacity=".7" />
      </g>

      {/* hills */}
      <path d="M0 470c160-60 300-80 460-50s260 20 420-30 340-40 480 0 180 40 240 40v270H0z" fill="#1d1b25" />

      {/* radio tower (The Last Broadcast) */}
      <g className="townscape__radio" stroke="#2e2b38" strokeWidth="4" fill="none">
        <path d="M1090 450l40-330 40 330M1100 380h60M1110 300h40M1118 220h24M1100 380l50-80M1160 380l-50-80M1110 300l32-80M1150 300l-32-80" />
        <circle className="townscape__beacon" cx="1130" cy="112" r="6" fill="#d8392b" stroke="none" />
      </g>

      {/* far roofs */}
      <g fill="#24212c">
        {FAR.map(([x, w, h, t], i) => (
          <path key={i} d={roof(x, w, h, t, 520)} />
        ))}
      </g>

      {/* clock tower (The Hollow Harvest) */}
      <g className="townscape__clock">
        <path d="M520 520V250l20-14V190l40-60 40 60v46l20 14v270z" fill="#2a2632" />
        <circle cx="580" cy="230" r="24" fill={lit ? '#e8c27a' : '#4a4452'} opacity={lit ? 0.9 : 1} />
        <path d="M580 230v-15M580 230l10 6" stroke="#2a2014" strokeWidth="3" strokeLinecap="round" />
        <path d="M566 300h28v40h-28z" fill="#1a1820" />
      </g>

      {/* the house with the crescent weathervane (The House with No Address), half hidden */}
      <g className="townscape__house">
        <path d="M380 520V360l60-50 60 50v160z" fill="#28252f" />
        <circle cx="440" cy="380" r="13" fill={lit ? '#d39a45' : '#3a3540'} opacity=".75" />
        <path d="M440 310v-34" stroke="#3b3744" strokeWidth="3" />
        <path d="M433 268a10 10 0 1 0 15 3 8 8 0 1 1-15-3z" fill="#5d5868" />
        <path d="M350 520c10-60 50-90 100-80 50-10 90 20 100 80z" fill="#1c2a22" />
      </g>

      <rect x="0" y="440" width="1600" height="120" fill="url(#ts-fog)" className="townscape__fog townscape__fog--far" />

      {/* near houses */}
      {NEAR.map(([x, w, h, t, wins], i) => (
        <g key={i}>
          <path d={roof(x, w, h, t, 610)} fill="#141218" />
          <rect x={x + w * 0.62} y={610 - h - 26} width="16" height="34" fill="#141218" />
          {windows &&
            wins.map(([wx, wy], j) => {
              wi += 1;
              const on = lit && (i + j) % 3 !== 1;
              return (
                <rect
                  key={j}
                  className={on ? 'townscape__win townscape__win--on' : 'townscape__win'}
                  style={{ '--i': wi }}
                  x={x + wx}
                  y={610 - h + wy}
                  width="20"
                  height="28"
                  rx="2"
                  fill={on ? '#f0b85e' : '#2a2731'}
                />
              );
            })}
        </g>
      ))}

      {/* street & lamps */}
      <rect x="0" y="606" width="1600" height="94" fill="url(#ts-street)" />
      {[220, 760, 1340].map((lx, i) => (
        <g key={lx} className="townscape__lamp" style={{ '--i': i }}>
          {lit && <circle cx={lx} cy="540" r="70" fill="url(#ts-lamp)" />}
          <path d={`M${lx} 610V546`} stroke="#0b0a0d" strokeWidth="5" />
          <path d={`M${lx - 9} 546h18l-4-14h-10z`} fill={lit ? '#ffcf7a' : '#3a3540'} />
          {lit && <ellipse cx={lx} cy="660" rx="40" ry="6" fill="#ffc35c" opacity=".18" />}
        </g>
      ))}
      <rect x="0" y="560" width="1600" height="140" fill="url(#ts-fog)" className="townscape__fog townscape__fog--near" />
    </svg>
  );
}
