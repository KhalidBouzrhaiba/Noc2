// Original SVG props for the investigation scenes. Each entry: viewBox + drawing.
// Interactive objects render one of these inside a button; the content data picks the prop.

const C = {
  ink: '#121017', char: '#1e1b24', char2: '#2a2632', wood: '#5a3a22', woodL: '#7a5232', woodD: '#3b2416',
  paper: '#e9dcc0', paperD: '#c9b48c', brass: '#c99a3b', rust: '#8f3a24', red: '#b3261e', amber: '#f0b85e',
  moss: '#4f6b3f', mossD: '#2f4127', fog: '#8f8a98', purple: '#5b4a7a', metal: '#5e5a66', metalL: '#8d8896', pumpkin: '#d9731f', cream: '#f3e8cf',
};

const lines = (n, x, y, w, gap, color = C.paperD) =>
  Array.from({ length: n }, (_, i) => <path key={i} d={`M${x} ${y + i * gap}h${w - (i % 3) * 6}`} stroke={color} strokeWidth="2" strokeLinecap="round" />);

const person = (coat, scarf, extra = null) => (
  <>
    <ellipse cx="50" cy="196" rx="34" ry="5" fill="#000" opacity=".35" />
    <path d="M22 196c0-48 6-86 28-98 22 12 28 50 28 98z" fill={coat} />
    <path d="M38 104c4 8 20 8 24 0l-2 14c-6 4-14 4-20 0z" fill={scarf} />
    <circle cx="50" cy="80" r="17" fill="#c69a74" />
    <path d="M33 78c0-14 8-22 17-22s17 8 17 22c-4-6-10-9-17-9s-13 3-17 9z" fill={C.ink} />
    {extra}
  </>
);

export const PROPS = {
  console: {
    vb: '0 0 300 140',
    el: (
      <>
        <path d="M10 130 30 50h240l20 80z" fill={C.char2} />
        <rect x="30" y="40" width="240" height="14" rx="3" fill={C.metal} />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <rect x={44 + i * 22} y="70" width="8" height="44" rx="3" fill={C.ink} />
            <rect x={42 + i * 22} y={78 + ((i * 17) % 26)} width="12" height="8" rx="2" fill={C.metalL} />
          </g>
        ))}
        <circle cx="270" cy="30" r="9" fill={C.red} className="glow-red" />
        <text x="270" y="14" fill={C.red} fontSize="9" textAnchor="middle" fontFamily="monospace">ON AIR</text>
      </>
    ),
  },
  logbook: {
    vb: '0 0 120 90',
    el: (
      <>
        <path d="M6 20 60 12l54 8v62l-54-6-54 6z" fill={C.woodD} />
        <path d="M10 20 60 14v60l-50 6zM110 20 60 14v60l50 6z" fill={C.paper} />
        {lines(5, 16, 28, 36, 9)}
        {lines(5, 66, 28, 36, 9)}
        <path d="M60 14v62" stroke={C.paperD} strokeWidth="2" />
      </>
    ),
  },
  reel: {
    vb: '0 0 130 110',
    el: (
      <>
        <rect x="8" y="50" width="114" height="54" rx="6" fill={C.char2} />
        <rect x="18" y="62" width="40" height="10" rx="2" fill={C.ink} />
        {[34, 96].map((x) => (
          <g key={x} className="spin-slow" style={{ transformOrigin: `${x}px 34px` }}>
            <circle cx={x} cy="34" r="28" fill={C.metal} />
            <circle cx={x} cy="34" r="22" fill="#3b2b23" />
            <circle cx={x} cy="34" r="6" fill={C.metalL} />
            <path d={`M${x} 14v12M${x - 17} 44l10-6M${x + 17} 44l-10-6`} stroke={C.metalL} strokeWidth="4" />
          </g>
        ))}
        <circle cx="96" cy="86" r="8" fill={C.metalL} />
      </>
    ),
  },
  board: {
    vb: '0 0 140 100',
    el: (
      <>
        <rect x="4" y="4" width="132" height="92" rx="4" fill={C.woodL} />
        <rect x="10" y="10" width="120" height="80" fill="#b98e5e" />
        <rect x="18" y="18" width="40" height="50" fill={C.paper} transform="rotate(-4 38 43)" />
        <rect x="66" y="16" width="52" height="34" fill={C.cream} transform="rotate(3 92 33)" />
        <rect x="70" y="56" width="40" height="28" fill={C.paperD} transform="rotate(-2 90 70)" />
        {lines(3, 24, 32, 28, 9)}
        {[[38, 20], [92, 18], [90, 58]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" fill={C.red} />)}
      </>
    ),
  },
  whiteboard: {
    vb: '0 0 160 110',
    el: (
      <>
        <rect x="4" y="4" width="152" height="92" rx="3" fill={C.metalL} />
        <rect x="10" y="10" width="140" height="80" fill="#e8e6e0" />
        <path d="M22 30h40M22 46h70M22 62h30" stroke="#7a8aa8" strokeWidth="3" strokeLinecap="round" opacity=".5" />
        <path d="M110 30l18 18M128 30l-18 18" stroke={C.rust} strokeWidth="3" opacity=".5" />
        <path d="M20 96v12M140 96v12" stroke={C.metal} strokeWidth="4" />
      </>
    ),
  },
  frame: {
    vb: '0 0 80 100',
    el: (
      <>
        <rect x="4" y="4" width="72" height="92" fill={C.brass} />
        <rect x="11" y="11" width="58" height="78" fill="#3e3a33" />
        <path d="M11 70c10-14 20-20 30-16s20 14 28 6v29H11z" fill="#5a5448" />
        <path d="M20 66a6 6 0 0 1 12 0v12h-12zM40 62a6 6 0 0 1 12 0v16h-12z" fill="#2a2620" />
        <path d="M58 74l4-8 3 8z" fill="#141210" />
      </>
    ),
  },
  folder: {
    vb: '0 0 120 90',
    el: (
      <>
        <path d="M6 18h40l8 8h60v58H6z" fill="#b48a4c" />
        <rect x="14" y="20" width="92" height="62" fill={C.paper} transform="rotate(-3 60 50)" />
        {lines(4, 24, 36, 60, 10)}
        <path d="M6 30h108v54H6z" fill="#c99a5a" opacity=".9" />
        <rect x="70" y="40" width="32" height="12" fill={C.red} opacity=".75" />
      </>
    ),
  },
  paper: {
    vb: '0 0 80 100',
    el: (
      <>
        <path d="M8 6h50l14 14v74H8z" fill={C.paper} />
        <path d="M58 6v14h14" fill={C.paperD} />
        {lines(6, 16, 30, 48, 10)}
      </>
    ),
  },
  printout: {
    vb: '0 0 90 110',
    el: (
      <>
        <path d="M10 4h70v90c-8 4-14-4-20 0s-12 4-18 0-14 4-20 0-8 4-12 0z" fill="#efeadf" />
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx="16" cy={14 + i * 10} r="2" fill="#bdb6a6" />
        ))}
        {lines(7, 26, 16, 46, 10, '#7a7466')}
      </>
    ),
  },
  officer: { vb: '0 0 100 200', el: person('#1f2a44', '#2d3b5c', <path d="M33 66h34l-4-10H37z" fill="#0f1526" />) },
  editor: { vb: '0 0 100 200', el: person('#4a3b2e', C.rust, <path d="M40 82h8M52 82h8" stroke="#222" strokeWidth="2" />) },
  cashier: { vb: '0 0 100 200', el: person('#3f5a4a', C.amber) },
  archivist: { vb: '0 0 100 200', el: person('#3a3446', C.paperD, <circle cx="50" cy="82" r="6" fill="none" stroke={C.brass} strokeWidth="2" />) },
  oldman: {
    vb: '0 0 120 200',
    el: (
      <>
        {person('#5a4c3a', '#7d6a4a', <path d="M33 66c8-4 26-4 34 0" stroke="#cfc8b8" strokeWidth="5" />)}
        <path d="M86 110v86" stroke={C.woodD} strokeWidth="5" strokeLinecap="round" />
        <rect x="0" y="150" width="120" height="10" fill={C.wood} />
      </>
    ),
  },
  keyhook: {
    vb: '0 0 60 100',
    el: (
      <>
        <rect x="10" y="6" width="40" height="14" rx="3" fill={C.wood} />
        <path d="M30 20v12" stroke={C.metalL} strokeWidth="3" />
        <g className="sway">
          <circle cx="30" cy="42" r="9" fill="none" stroke={C.brass} strokeWidth="4" />
          <path d="M30 51v34m0-10h8m-8 8h6" stroke={C.brass} strokeWidth="4" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  wallmap: {
    vb: '0 0 180 120',
    el: (
      <>
        <rect x="4" y="4" width="172" height="112" fill="#d8ccb0" />
        <path d="M20 30h60v40H20zM90 20h70v50H90zM30 80h120v24H30z" fill="none" stroke="#8c7c5c" strokeWidth="2" />
        <path d="M90 20h70v50H90z" fill={C.red} opacity=".28" />
        <path d="M60 10v100M10 76h160" stroke="#9c8a6a" strokeWidth="5" opacity=".6" />
        <circle cx="140" cy="36" r="4" fill={C.red} />
      </>
    ),
  },
  typewriter: {
    vb: '0 0 150 110',
    el: (
      <>
        <path d="M30 10h90v40H30z" fill={C.paper} />
        {lines(3, 40, 20, 70, 8)}
        <rect x="20" y="40" width="110" height="14" rx="7" fill={C.ink} />
        <path d="M14 104 26 54h98l12 50z" fill="#2c3a3a" />
        {Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 9 }, (_, i) => <circle key={`${r}${i}`} cx={38 + i * 10 + r * 3} cy={70 + r * 11} r="3.5" fill={C.cream} />),
        )}
      </>
    ),
  },
  freezer: {
    vb: '0 0 200 120',
    el: (
      <>
        <rect x="6" y="30" width="188" height="86" rx="6" fill="#d9dde0" />
        <rect x="14" y="20" width="172" height="22" rx="4" fill="#9fb4c0" opacity=".7" />
        <rect x="130" y="56" width="50" height="30" rx="3" fill={C.ink} />
        <text x="155" y="76" fill="#7ee08f" fontSize="13" textAnchor="middle" fontFamily="monospace">-18°</text>
        <path d="M24 60h90M24 74h70" stroke="#b3bcc2" strokeWidth="3" />
      </>
    ),
  },
  spike: {
    vb: '0 0 50 110',
    el: (
      <>
        <path d="M25 4v80" stroke={C.metalL} strokeWidth="3" />
        {[30, 40, 50, 60, 70].map((y, i) => (
          <rect key={y} x={8 + (i % 2) * 4} y={y} width="30" height="8" fill={C.paper} transform={`rotate(${(i - 2) * 6} 25 ${y})`} />
        ))}
        <ellipse cx="25" cy="92" rx="20" ry="8" fill={C.metal} />
      </>
    ),
  },
  radio: {
    vb: '0 0 90 70',
    el: (
      <>
        <rect x="6" y="14" width="78" height="52" rx="8" fill={C.rust} />
        <circle cx="30" cy="40" r="16" fill="#5a2a1c" />
        <rect x="52" y="28" width="24" height="10" rx="2" fill={C.amber} />
        <circle cx="64" cy="52" r="5" fill={C.cream} />
        <path d="M20 14 34 2" stroke={C.metalL} strokeWidth="3" />
      </>
    ),
  },
  notebook: {
    vb: '0 0 80 100',
    el: (
      <>
        <rect x="8" y="6" width="64" height="88" rx="4" fill="#3d4a5a" />
        <rect x="14" y="10" width="54" height="80" rx="2" fill={C.paper} />
        {lines(6, 20, 26, 42, 10, '#9aa6b8')}
        <path d="M58 4l10 70" stroke={C.brass} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  teacup: {
    vb: '0 0 70 90',
    el: (
      <>
        <ellipse cx="35" cy="82" rx="30" ry="6" fill={C.paperD} />
        <path d="M14 20h42l-6 58H20z" fill="#e8d8a8" opacity=".55" />
        <path d="M16 40h38l-4 38H20z" fill="#9a5a20" opacity=".7" />
        <path d="M14 20h42" stroke={C.brass} strokeWidth="2" />
        <circle cx="42" cy="82" r="3" fill={C.brass} className="glint" />
      </>
    ),
  },
  wardrobe: {
    vb: '0 0 120 200',
    el: (
      <>
        <rect x="6" y="6" width="108" height="188" rx="4" fill={C.wood} />
        <rect x="14" y="16" width="44" height="170" fill={C.woodL} />
        <path d="M62 16h44v170H62z" fill="#1b1410" />
        <path d="M66 40h36" stroke={C.metalL} strokeWidth="2" />
        <path d="M72 40v10m14-10v10" stroke={C.metalL} strokeWidth="1.5" />
        <circle cx="54" cy="100" r="3" fill={C.brass} />
      </>
    ),
  },
  gate: {
    vb: '0 0 220 160',
    el: (
      <>
        <rect x="4" y="10" width="16" height="146" fill={C.metal} />
        <rect x="200" y="10" width="16" height="146" fill={C.metal} />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${34 + i * 20} 30v126`} stroke={C.char2} strokeWidth="6" />
        ))}
        <path d="M20 40h180M20 140h180" stroke={C.char2} strokeWidth="8" />
        <path className="gate-chain" d="M100 70c10 10 10 30 20 40" stroke={C.metalL} strokeWidth="5" strokeDasharray="6 4" fill="none" />
        <rect className="gate-chain" x="106" y="86" width="16" height="18" rx="3" fill={C.brass} />
      </>
    ),
  },
  plaque: {
    vb: '0 0 100 70',
    el: (
      <>
        <rect x="4" y="4" width="92" height="62" rx="6" fill={C.brass} />
        <rect x="10" y="10" width="80" height="50" rx="4" fill="none" stroke="#8a6a24" strokeWidth="2" />
        <text x="50" y="44" fill="#5a4416" fontSize="20" textAnchor="middle" fontFamily="'IM Fell English', serif">1962</text>
      </>
    ),
  },
  keypad: {
    vb: '0 0 60 90',
    el: (
      <>
        <rect x="4" y="4" width="52" height="82" rx="6" fill={C.metal} />
        <rect x="12" y="12" width="36" height="12" rx="2" fill="#16301e" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={12 + (i % 3) * 13} y={30 + Math.floor(i / 3) * 13} width="10" height="10" rx="2" fill={C.metalL} />
        ))}
      </>
    ),
  },
  puddle: {
    vb: '0 0 160 50',
    el: (
      <>
        <ellipse cx="80" cy="26" rx="76" ry="20" fill="#2b241c" />
        {[[40, 22], [62, 30], [90, 18], [112, 28]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={i < 2 ? 9 : 6} ry={i < 2 ? 4 : 3} fill="#120e0a" />
        ))}
      </>
    ),
  },
  breaker: {
    vb: '0 0 120 140',
    el: (
      <>
        <rect x="6" y="6" width="108" height="128" rx="4" fill="#5e6660" />
        <rect x="14" y="14" width="92" height="84" fill="#2a302c" />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={22 + (i % 4) * 21} y={22 + Math.floor(i / 4) * 38} width="14" height="28" rx="2" fill="#1a1e1b" />
            <rect x={25 + (i % 4) * 21} y={i === 0 ? 26 : 36 + Math.floor(i / 4) * 38 - 10} width="8" height="12" fill={i === 0 ? C.red : '#d0d4cc'} />
          </g>
        ))}
        <rect x="18" y="106" width="84" height="20" rx="2" fill={C.paper} />
        {lines(2, 24, 112, 70, 7, '#7a7466')}
      </>
    ),
  },
  lockers: {
    vb: '0 0 200 160',
    el: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={6 + (i % 4) * 48} y={6 + Math.floor(i / 4) * 76} width="44" height="72" fill={i === 6 ? '#59614e' : '#4a5248'} stroke="#2a2f28" strokeWidth="2" />
            <text x={28 + (i % 4) * 48} y={30 + Math.floor(i / 4) * 76} fill={C.cream} fontSize="14" textAnchor="middle" fontFamily="monospace">{i + 1}</text>
            <path d={`M${12 + (i % 4) * 48} ${50 + Math.floor(i / 4) * 76}h32`} stroke="#2a2f28" strokeWidth="2" />
          </g>
        ))}
        <rect x="114" y="120" width="10" height="12" rx="2" fill={C.brass} />
      </>
    ),
  },
  thermos: {
    vb: '0 0 40 100',
    el: (
      <>
        <rect x="8" y="14" width="24" height="80" rx="6" fill="#4e6a5a" />
        <rect x="10" y="4" width="20" height="14" rx="3" fill={C.metalL} />
        <text x="20" y="60" fill={C.cream} fontSize="9" textAnchor="middle" fontFamily="monospace">V.H.</text>
      </>
    ),
  },
  stall: {
    vb: '0 0 220 200',
    el: (
      <>
        <path d="M10 60 30 10h160l20 50z" fill={C.rust} />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${30 + i * 32} 10l-6 50h20z`} fill={C.cream} opacity=".85" />
        ))}
        <rect x="20" y="60" width="180" height="10" fill={C.woodD} />
        <path d="M30 70v120M190 70v120" stroke={C.woodD} strokeWidth="8" />
        <rect x="20" y="130" width="180" height="60" fill={C.wood} />
        {[50, 80, 150].map((x) => (
          <ellipse key={x} cx={x} cy="128" rx="16" ry="12" fill={C.pumpkin} />
        ))}
        <g transform="translate(96 40) scale(.7)">{person('#4b3a2a', C.amber)}</g>
      </>
    ),
  },
  poster: {
    vb: '0 0 80 110',
    el: (
      <>
        <rect x="6" y="6" width="68" height="98" fill="#e6dcc4" transform="rotate(3 40 55)" />
        <text x="40" y="34" fill={C.ink} fontSize="12" textAnchor="middle" fontFamily="'IM Fell English', serif" transform="rotate(3 40 55)">THE</text>
        <text x="40" y="52" fill={C.red} fontSize="14" textAnchor="middle" fontFamily="'IM Fell English', serif" transform="rotate(3 40 55)">HOLLOW</text>
        <text x="40" y="70" fill={C.ink} fontSize="12" textAnchor="middle" fontFamily="'IM Fell English', serif" transform="rotate(3 40 55)">WAKES</text>
        <circle cx="40" cy="88" r="7" fill="none" stroke={C.ink} strokeWidth="2" transform="rotate(3 40 55)" />
      </>
    ),
  },
  scarecrow: {
    vb: '0 0 100 200',
    el: (
      <>
        <path d="M50 40v156M10 70h80" stroke={C.woodD} strokeWidth="7" strokeLinecap="round" />
        <path d="M30 70h40l6 70H24z" fill="#6b5a38" />
        <circle cx="50" cy="44" r="18" fill={C.pumpkin} />
        <path d="M30 30h40l-6-18H36z" fill={C.ink} />
        <path d="M42 44l3-4 3 4zM52 44l3-4 3 4zM42 52h16" stroke={C.ink} strokeWidth="2" fill={C.ink} />
        <path d="M10 194c20-6 60-6 80 0" stroke="#c9c2b0" strokeWidth="2" strokeDasharray="3 4" />
      </>
    ),
  },
  hatch: {
    vb: '0 0 140 70',
    el: (
      <>
        <path d="M6 64 20 10h100l14 54z" fill="#3d3a33" />
        <path d="M24 16h92l10 42H14z" fill="#55514a" />
        <path d="M30 28h80M26 42h88" stroke="#3d3a33" strokeWidth="3" />
        <text x="70" y="38" fill={C.amber} fontSize="9" textAnchor="middle" fontFamily="monospace">SERVICE</text>
        <rect x="64" y="46" width="12" height="10" rx="2" fill={C.brass} />
      </>
    ),
  },
  clockface: {
    vb: '0 0 140 140',
    el: (
      <>
        <circle cx="70" cy="70" r="66" fill={C.woodD} />
        <circle cx="70" cy="70" r="56" fill="#e8d7a6" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M70 18v10" stroke={C.ink} strokeWidth="3" transform={`rotate(${i * 30} 70 70)`} />
        ))}
        <path className="clock-hand" d="M70 70V30" stroke={C.ink} strokeWidth="4" strokeLinecap="round" style={{ transformOrigin: '70px 70px' }} />
        <path d="M70 70l22 12" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
        <circle cx="70" cy="70" r="5" fill={C.brass} />
      </>
    ),
  },
  motor: {
    vb: '0 0 120 100',
    el: (
      <>
        <rect x="10" y="30" width="76" height="50" rx="8" fill="#5a6a5e" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${20 + i * 11} 34v42`} stroke="#43514a" strokeWidth="3" />)}
        <rect x="86" y="46" width="24" height="16" fill={C.metalL} />
        <path d="M30 80c0 14 60 10 70 16" stroke={C.ink} strokeWidth="4" fill="none" />
        <rect x="58" y="86" width="22" height="10" fill={C.amber} />
        <text x="69" y="94" fill={C.ink} fontSize="8" textAnchor="middle" fontFamily="monospace">L2</text>
      </>
    ),
  },
  ribbon: {
    vb: '0 0 90 50',
    el: (
      <>
        <path d="M4 30c20-20 40 14 60-6 10-10 16-8 22-4l-6 10c-6-4-10-4-16 2-20 20-40-12-56 8z" fill={C.red} />
        <path d="M14 26c14-8 26 4 40-2" stroke={C.amber} strokeWidth="1.5" strokeDasharray="2 3" fill="none" />
        <ellipse cx="44" cy="40" rx="40" ry="6" fill="#3b2c1c" opacity=".5" />
      </>
    ),
  },
  lever: {
    vb: '0 0 50 120',
    el: (
      <>
        <rect x="18" y="60" width="14" height="56" fill={C.metal} />
        <path d="M25 64 40 8" stroke={C.metalL} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="8" r="6" fill={C.woodD} />
        {[[30, 40], [34, 30]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="2.5" fill="#d8cfc0" opacity=".6" />)}
      </>
    ),
  },
  wallclock: {
    vb: '0 0 80 80',
    el: (
      <>
        <circle cx="40" cy="40" r="36" fill={C.metalL} />
        <circle cx="40" cy="40" r="30" fill="#f4f1ea" />
        <path d="M40 40V18M40 40l14 8" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M58 22l6-6m-2 8 6-2" stroke={C.red} strokeWidth="2" />
      </>
    ),
  },
  shed: {
    vb: '0 0 220 180',
    el: (
      <>
        <path d="M10 70 110 10l100 60z" fill={C.woodD} />
        <rect x="24" y="68" width="172" height="106" fill={C.wood} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${34 + i * 21} 70v104`} stroke={C.woodD} strokeWidth="2" />)}
        <rect x="88" y="100" width="44" height="74" fill="#1a120c" />
        <path d="M110 110v14" stroke={C.brass} strokeWidth="3" />
        <circle cx="110" cy="130" r="5" fill="none" stroke={C.brass} strokeWidth="3" />
        <path d="M170 40c10 10 18 4 30 14" stroke={C.moss} strokeWidth="6" fill="none" />
      </>
    ),
  },
  lantern: {
    vb: '0 0 140 110',
    el: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 34} 0)`}>
            {i === 2 ? (
              <rect x="8" y="40" width="26" height="60" fill="none" stroke="#6a6052" strokeDasharray="3 3" />
            ) : (
              <>
                <path d="M14 30h14l4 10H10z" fill={C.metal} />
                <rect x="10" y="40" width="22" height="50" rx="3" fill="#3a3328" />
                <rect x="14" y="46" width="14" height="36" fill={i === 0 ? C.amber : '#5a4e3a'} opacity=".8" />
                <path d="M21 30V20" stroke={C.metal} strokeWidth="2" />
              </>
            )}
          </g>
        ))}
        <rect x="0" y="100" width="140" height="8" fill={C.woodD} />
      </>
    ),
  },
  timer: {
    vb: '0 0 140 140',
    el: (
      <>
        <rect x="6" y="6" width="128" height="128" rx="6" fill="#4a4a4e" />
        <circle cx="70" cy="56" r="38" fill="#e8e2d0" />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M70 22v6" stroke={C.ink} strokeWidth={i % 6 ? 1 : 3} transform={`rotate(${i * 15} 70 56)`} />
        ))}
        <path d="M70 56V28" stroke={C.red} strokeWidth="3" />
        <rect x="24" y="102" width="92" height="22" fill="#d9c79a" />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={32 + i * 9} cy="113" r="2.4" fill={i === 4 || i === 6 ? C.ink : '#a8946a'} />)}
      </>
    ),
  },
  map: {
    vb: '0 0 180 120',
    el: (
      <>
        <path d="M6 14 60 4l60 10 54-10v102l-54 10-60-10-54 10z" fill="#d9c9a2" />
        <path d="M60 4v102M120 14v102" stroke="#b8a479" strokeWidth="2" />
        <path d="M14 40h150M14 74h150M44 14v96M134 14v96" stroke="#9a875c" strokeWidth="3" opacity=".7" />
        {[[30, 30], [52, 30], [76, 30], [98, 30]].map(([x, y]) => <rect key={x} x={x} y={y + 14} width="14" height="12" fill="#8a7650" opacity=".6" />)}
        <circle cx="83" cy="50" r="9" fill="none" stroke={C.red} strokeWidth="2" />
      </>
    ),
  },
  lighttable: {
    vb: '0 0 160 110',
    el: (
      <>
        <path d="M10 44h140l-10 30H20z" fill="#f6ecc9" />
        <path d="M10 44h140l-10 30H20z" fill={C.amber} opacity=".35" className="pulse-soft" />
        <path d="M20 74v32M140 74v32" stroke={C.woodD} strokeWidth="6" />
        <path d="M34 46l40-6 40 6" stroke="#b7a26f" strokeWidth="2" fill="none" />
      </>
    ),
  },
  well: {
    vb: '0 0 160 140',
    el: (
      <>
        <path d="M20 60h120v70H20z" fill="#6d665a" />
        {Array.from({ length: 4 }, (_, r) => <path key={r} d={`M20 ${76 + r * 16}h120`} stroke="#4e483e" strokeWidth="2" />)}
        <ellipse cx="80" cy="60" rx="60" ry="12" fill="#2a2620" />
        <path d="M30 60V16M130 60V16M24 16h112" stroke={C.woodD} strokeWidth="7" strokeLinecap="round" />
        <path d="M80 16v30" stroke={C.metalL} strokeWidth="2" />
        <rect x="70" y="44" width="20" height="14" rx="2" fill={C.wood} />
      </>
    ),
  },
  cabinet: {
    vb: '0 0 120 170',
    el: (
      <>
        <rect x="6" y="6" width="108" height="158" rx="3" fill="#5c6a6a" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="14" y={14 + i * 50} width="92" height="44" rx="2" fill="#6f7e7e" />
            <rect x="46" y={24 + i * 50} width="28" height="8" rx="2" fill={C.metalL} />
            <rect x="48" y={36 + i * 50} width="24" height="10" fill={C.paper} />
          </g>
        ))}
        <rect x="14" y="64" width="92" height="6" fill={C.paper} />
      </>
    ),
  },
  facade: {
    vb: '0 0 220 200',
    el: (
      <>
        <rect x="10" y="40" width="200" height="160" fill="#4a4048" />
        <path d="M0 44 110 4l110 40z" fill="#2a242c" />
        {[[40, 70], [150, 70], [40, 130]].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="34" height="40" fill={C.amber} opacity=".75" />
        ))}
        <rect x="140" y="128" width="36" height="72" fill="#1a1418" />
        <rect x="150" y="110" width="20" height="12" rx="2" fill="#2f5d8a" />
        <text x="160" y="120" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">13</text>
      </>
    ),
  },
  hedge: {
    vb: '0 0 280 200',
    el: (
      <>
        <rect x="150" y="60" width="120" height="140" fill="#433a3e" />
        <path d="M140 64 210 24l70 40z" fill="#2a242c" />
        <rect x="236" y="110" width="22" height="12" rx="2" fill="#2f5d8a" />
        <text x="247" y="120" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">15</text>
        <path d="M0 200V70c10-24 30-30 44-20 10-24 40-26 52-6 16-16 40-8 46 10 10 6 14 20 10 34v112z" fill={C.mossD} />
        <path d="M10 120c20-10 40 4 60-4s40 6 60-2" stroke={C.moss} strokeWidth="6" fill="none" opacity=".6" />
      </>
    ),
  },
  weathervane: {
    vb: '0 0 70 100',
    el: (
      <g className="vane">
        <path d="M35 100V40" stroke={C.metal} strokeWidth="4" />
        <path d="M8 46h54" stroke={C.metal} strokeWidth="3" />
        <path d="M26 14a14 14 0 1 0 20 4 11 11 0 1 1-20-4z" fill="#7d7888" />
      </g>
    ),
  },
  clipboard: {
    vb: '0 0 80 100',
    el: (
      <>
        <rect x="8" y="10" width="64" height="86" rx="4" fill={C.woodL} />
        <rect x="16" y="18" width="48" height="66" fill={C.paper} />
        <path d="M22 30h36v26H22z" fill="#7a7060" />
        <path d="M30 40a5 5 0 1 0 8 2 4 4 0 1 1-8-2z" fill={C.cream} />
        <rect x="28" y="4" width="24" height="12" rx="3" fill={C.metal} />
      </>
    ),
  },
  plate: {
    vb: '0 0 90 60',
    el: (
      <>
        <path d="M0 50c20-12 70-12 90 0v10H0z" fill="#3b2f22" />
        <rect x="14" y="10" width="62" height="40" rx="6" fill="#2f5d8a" transform="rotate(-8 45 30)" />
        <text x="45" y="38" fill="#f1ede2" fontSize="22" textAnchor="middle" fontFamily="'IM Fell English', serif" transform="rotate(-8 45 30)">7</text>
      </>
    ),
  },
  door: {
    vb: '0 0 140 200',
    el: (
      <>
        <rect x="10" y="20" width="120" height="180" fill="#3a3238" />
        <rect x="24" y="40" width="92" height="160" fill={C.woodD} />
        <rect x="30" y="4" width="80" height="22" fill="#6d665a" />
        <text x="70" y="20" fill="#2a2620" fontSize="11" textAnchor="middle" fontFamily="'IM Fell English', serif">I.M. 1921</text>
        <rect x="88" y="110" width="20" height="30" rx="3" fill={C.brass} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x="90" y={113 + i * 6.5} width="16" height="5" fill="#7a5a1c" />)}
        <path d="M0 60c20-10 30 10 40 0" stroke={C.moss} strokeWidth="6" fill="none" />
      </>
    ),
  },
  roundwindow: {
    vb: '0 0 80 80',
    el: (
      <>
        <circle cx="40" cy="40" r="36" fill="#3a3238" />
        <circle cx="40" cy="40" r="28" fill="#c79a4e" opacity=".6" />
        <path d="M40 12v56M12 40h56" stroke="#3a3238" strokeWidth="4" />
        <path d="M50 18l-8 16" stroke="#f0e6d0" strokeWidth="1.5" opacity=".8" />
      </>
    ),
  },
  drawer: {
    vb: '0 0 160 120',
    el: (
      <>
        <rect x="6" y="20" width="148" height="96" fill={C.woodD} />
        <rect x="6" y="10" width="148" height="14" fill={C.wood} />
        <rect x="16" y="34" width="128" height="34" fill={C.wood} />
        <rect x="16" y="74" width="128" height="34" fill={C.wood} />
        <rect x="70" y="46" width="20" height="8" rx="3" fill={C.brass} />
        <rect x="70" y="86" width="20" height="8" rx="3" fill={C.brass} />
        <path d="M30 4h30l6 6H24z" fill={C.paper} />
      </>
    ),
  },
  bookcase: {
    vb: '0 0 140 200',
    el: (
      <>
        <rect x="6" y="6" width="128" height="188" fill={C.woodD} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x="12" y={44 + r * 46} width="116" height="6" fill={C.wood} />
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={16 + i * 12} y={14 + r * 46 + (i % 3) * 3} width="10" height={30 - (i % 3) * 3} fill={['#6b2d24', '#2f4127', '#3d4a5a', '#7a5232'][(i + r) % 4]} />
            ))}
          </g>
        ))}
        <path d="M62 100a8 8 0 1 0 14 2 6 6 0 1 1-14-2z" fill="#0c0806" stroke={C.brass} strokeWidth="1.5" />
      </>
    ),
  },
  envelope: {
    vb: '0 0 120 90',
    el: (
      <>
        <rect x="14" y="20" width="96" height="62" fill={C.paperD} transform="rotate(6 62 51)" />
        <rect x="8" y="16" width="96" height="62" fill={C.paper} />
        <path d="M8 16l48 32 48-32" stroke={C.paperD} strokeWidth="2" fill="none" />
        <circle cx="56" cy="50" r="9" fill={C.rust} />
        <path d="M0 48h112" stroke={C.red} strokeWidth="2" opacity=".5" />
      </>
    ),
  },
};

export function Prop({ name, className = '' }) {
  const p = PROPS[name];
  if (!p) return null;
  return (
    <svg className={`prop prop--${name} ${className}`} viewBox={p.vb} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {p.el}
    </svg>
  );
}

export function propAspect(name) {
  const p = PROPS[name];
  if (!p) return 1;
  const [, , w, h] = p.vb.split(' ').map(Number);
  return h / w;
}
