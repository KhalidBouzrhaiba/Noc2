// Original scene backdrops (1600×1000). Purely decorative: interactive objects are placed on
// top by the Scene component. Each location type has its own palette and set dressing.

function Interior({ id, wall, wall2, floor, floor2, light = '#ffcf7a', lightX = 800, lightOpacity = 0.28, children, window: win }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wall2} />
          <stop offset="1" stopColor={wall} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={floor} />
          <stop offset="1" stopColor={floor2} />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx=".5" cy=".3" r=".6">
          <stop offset="0" stopColor={light} stopOpacity={lightOpacity} />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".5" r=".75">
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".65" />
        </radialGradient>
      </defs>
      <rect width="1600" height="720" fill={`url(#${id}-wall)`} />
      <rect y="700" width="1600" height="300" fill={`url(#${id}-floor)`} />
      <path d="M0 700h1600v14H0z" fill="#000" opacity=".35" />
      {win && (
        <g>
          <rect x={win[0]} y={win[1]} width={win[2]} height={win[3]} fill="#16151f" />
          <rect x={win[0]} y={win[1]} width={win[2]} height={win[3]} fill="#2a2b3d" opacity=".6" className="rain" />
          <path d={`M${win[0] + win[2] / 2} ${win[1]}v${win[3]}M${win[0]} ${win[1] + win[3] / 2}h${win[2]}`} stroke="#0d0c12" strokeWidth="10" />
          <rect x={win[0] - 10} y={win[1] - 10} width={win[2] + 20} height={win[3] + 20} fill="none" stroke="#0d0c12" strokeWidth="14" />
        </g>
      )}
      {children}
      <ellipse cx={lightX} cy="300" rx="900" ry="700" fill={`url(#${id}-light)`} className="flicker" />
      <rect width="1600" height="1000" fill={`url(#${id}-vig)`} />
    </>
  );
}

function NightSky({ id, top = '#1b1a26', bottom = '#2e2a38' }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a7a1b0" stopOpacity="0" />
          <stop offset="1" stopColor="#a7a1b0" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />
    </>
  );
}

const Fog = ({ id, y = 640 }) => <rect y={y} width="1600" height="360" fill={`url(#${id}-fog)`} className="drift" />;

const Leaves = ({ seed = 1, color = '#9a4a1c', n = 14 }) => (
  <g opacity=".85">
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 233 * seed) % 1600;
      const y = 760 + ((i * 97) % 220);
      return <path key={i} d={`M${x} ${y}c8-10 22-10 26 0-8 8-20 8-26 0z`} fill={i % 3 ? color : '#c9842e'} transform={`rotate(${(i * 47) % 360} ${x + 13} ${y})`} />;
    })}
  </g>
);

const SCENES = {
  studio: () => (
    <Interior id="studio" wall="#2a1f24" wall2="#1a1418" floor="#2c2420" floor2="#161210" light="#ff6a4a" lightX={1300} lightOpacity={0.12}>
      {Array.from({ length: 6 }, (_, c) =>
        Array.from({ length: 3 }, (_, r) => <rect key={`${c}${r}`} x={80 + c * 120} y={90 + r * 120} width="104" height="104" rx="6" fill="#3a2b2f" opacity=".7" />),
      )}
      <rect x="980" y="120" width="440" height="270" fill="#0f0e14" stroke="#3a3238" strokeWidth="16" />
      <rect x="1000" y="140" width="400" height="230" fill="#20283a" opacity=".5" />
      <text x="1200" y="100" fill="#5a1a14" fontSize="34" textAnchor="middle" fontFamily="monospace" letterSpacing="6">ON AIR</text>
      <path d="M1180 470c0-40 40-40 40 0v120" stroke="#111" strokeWidth="10" fill="none" />
      <rect x="1150" y="430" width="34" height="60" rx="16" fill="#3a3a40" />
    </Interior>
  ),
  police: () => (
    <Interior id="police" wall="#26303a" wall2="#1a2128" floor="#2a2c30" floor2="#141518" light="#e8eef8" lightOpacity={0.16} window={[1180, 140, 300, 260]}>
      <rect x="0" y="560" width="1600" height="140" fill="#1e252c" />
      {[60, 240, 420].map((x) => (
        <rect key={x} x={x} y="420" width="150" height="280" fill="#3a444e" />
      ))}
      <rect x="0" y="40" width="1600" height="16" fill="#3c4a56" />
      <path d="M700 0v80" stroke="#111" strokeWidth="4" />
      <path d="M660 80h80l-20 30h-40z" fill="#d8dce0" />
    </Interior>
  ),
  newsroom: () => (
    <Interior id="newsroom" wall="#3a2f26" wall2="#251d17" floor="#3a2a1c" floor2="#1c140d" window={[90, 120, 260, 300]}>
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={1000 + i * 100} y="80" width="80" height="120" fill="#d8ccb0" opacity=".25" transform={`rotate(${(i - 2) * 3} ${1040 + i * 100} 140)`} />
      ))}
      <rect x="380" y="560" width="900" height="30" fill="#4a3220" />
      <rect x="400" y="590" width="20" height="120" fill="#2c1e14" />
      <rect x="1240" y="590" width="20" height="120" fill="#2c1e14" />
      <path d="M760 0v110" stroke="#111" strokeWidth="4" />
      <path d="M720 110h80l-14 28h-52z" fill="#3a6a4a" />
    </Interior>
  ),
  market: () => (
    <Interior id="market" wall="#2e3438" wall2="#20262a" floor="#3a3c3c" floor2="#1e2020" light="#eaf6ff" lightOpacity={0.2}>
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <rect x={60 + i * 380} y="40" width="260" height="10" fill="#f1f6ff" className={i === 2 ? 'buzz' : undefined} />
        </g>
      ))}
      {[0, 1, 2].map((r) =>
        Array.from({ length: 6 }, (_, i) => (
          <rect key={`${r}${i}`} x={400 + i * 90} y={230 + r * 110} width="70" height="80" fill={['#8f3a24', '#d9731f', '#4f6b3f', '#c99a3b'][(i + r) % 4]} opacity=".55" />
        )),
      )}
      <rect x="380" y="200" width="560" height="10" fill="#555" />
      <rect x="380" y="310" width="560" height="10" fill="#555" />
      <rect x="380" y="420" width="560" height="10" fill="#555" />
      <rect x="1060" y="520" width="440" height="180" fill="#3a3f44" />
      <text x="1300" y="140" fill="#d9731f" fontSize="44" textAnchor="middle" fontFamily="monospace" opacity=".8">24/7</text>
      <path d="M1210 112h40l-8 36h-26zM1222 154a5 5 0 1 0 0 1M1240 154a5 5 0 1 0 0 1" stroke="#d9731f" strokeWidth="5" fill="none" opacity=".8" />
    </Interior>
  ),
  apartment: () => (
    <Interior id="apartment" wall="#33282e" wall2="#221a1f" floor="#3d2a1e" floor2="#1e140e" window={[620, 110, 340, 360]}>
      <rect x="120" y="140" width="220" height="160" fill="#4a3a32" />
      <rect x="132" y="152" width="196" height="136" fill="#7a6a58" opacity=".5" />
      <rect x="100" y="560" width="520" height="24" fill="#5a3a22" />
      <path d="M1380 0v120" stroke="#111" strokeWidth="3" />
      <circle cx="1380" cy="140" r="26" fill="#ffcf7a" opacity=".6" className="flicker" />
      <rect x="1040" y="520" width="300" height="180" rx="20" fill="#4a2f3a" />
    </Interior>
  ),
  tower: () => (
    <>
      <NightSky id="tower" top="#14131c" bottom="#2b2633" />
      <g stroke="#3a3644" strokeWidth="10" fill="none">
        <path d="M640 900 800 40l160 860M680 700h240M710 520h180M740 340h120M680 700l200-180M920 700 720 520M710 520l150-180M890 520 740 340" />
      </g>
      <circle cx="800" cy="40" r="12" fill="#d8392b" className="beacon" />
      <path d="M0 860c300-30 600-40 900-20s500 20 700 0v160H0z" fill="#16141a" />
      <rect x="1080" y="560" width="300" height="300" fill="#2a2830" />
      <rect x="1180" y="660" width="100" height="200" fill="#121016" />
      <Fog id="tower" />
    </>
  ),
  machine: () => (
    <Interior id="machine" wall="#2c302e" wall2="#1c201e" floor="#2a2a28" floor2="#121210" light="#ffd38a" lightOpacity={0.14} lightX={500}>
      {[120, 180, 240].map((y, i) => (
        <path key={y} d={`M0 ${y}h1600`} stroke={['#3e4a44', '#4a3a2a', '#3a3a44'][i]} strokeWidth="18" />
      ))}
      <rect x="560" y="420" width="420" height="280" rx="10" fill="#3a4a42" />
      <rect x="590" y="450" width="140" height="90" fill="#2a3530" />
      <circle cx="880" cy="520" r="46" fill="#2a3530" />
      <path d="M0 980h1600" stroke="#c99a3b" strokeWidth="16" strokeDasharray="60 40" opacity=".35" />
      <path d="M1500 0v90" stroke="#111" strokeWidth="3" />
      <path d="M1470 90h60l-10 22h-40z" fill="#c8c08a" className="buzz" />
    </Interior>
  ),
  square: () => (
    <>
      <NightSky id="square" top="#1a1622" bottom="#3a2a2c" />
      <path d="M0 520V300l80-60 80 60v-40h120v260zM1300 520V280l70-70 90 60v-40h140v290z" fill="#221c24" />
      <path d="M560 520V200l20-12v-50l40-60 40 60v50l20 12v320z" fill="#2a2430" />
      <circle cx="620" cy="190" r="22" fill="#e8c27a" opacity=".85" />
      {Array.from({ length: 3 }, (_, k) => (
        <path key={k} d={`M0 ${190 + k * 40}c400 ${80 - k * 20} 1200 ${80 - k * 20} 1600 0`} stroke="#151217" strokeWidth="2" fill="none" />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const x = 40 + i * 72;
        const y = 210 + Math.sin((i / 21) * Math.PI) * 70;
        return <circle key={i} cx={x} cy={y} r="9" fill={i % 4 === 0 ? '#e85d3a' : '#f0b85e'} className="lamp-string" style={{ '--i': i }} />;
      })}
      <path d="M0 600h1600v400H0z" fill="#2a2420" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 140} 600l-60 400`} stroke="#211b18" strokeWidth="3" />
      ))}
      <Leaves seed={3} />
      <Fog id="square" y={600} />
    </>
  ),
  clocktower: () => (
    <Interior id="clocktower" wall="#2a2622" wall2="#1a1714" floor="#2a221a" floor2="#120e0a" light="#ffd38a" lightOpacity={0.12} lightX={800}>
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={i * 240} y={0} width="20" height="720" fill="#3b2416" />
      ))}
      <path d="M760 40c-60 0-90 40-100 120h280c-10-80-40-120-100-120z" fill="#6a5430" />
      <path d="M800 40V0" stroke="#3b2416" strokeWidth="14" />
      <path d="M200 700l200-200h200l200-200" stroke="#3b2416" strokeWidth="24" fill="none" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={200 + i * 66} y={680 - i * 66} width="66" height="14" fill="#5a3a22" />
      ))}
      <rect x="1240" y="220" width="160" height="220" rx="80" fill="#12121c" />
      <rect x="1250" y="230" width="140" height="200" rx="70" fill="#25283a" opacity=".6" />
    </Interior>
  ),
  archive: () => (
    <Interior id="archive" wall="#2e2a24" wall2="#1e1b17" floor="#2c2620" floor2="#14110e" light="#ffdca0" lightOpacity={0.2} lightX={600}>
      {Array.from({ length: 4 }, (_, s) =>
        Array.from({ length: 4 }, (_, r) => (
          <g key={`${s}${r}`}>
            <rect x={140 + s * 360} y={80 + r * 150} width="300" height="10" fill="#4a3826" />
            {Array.from({ length: 5 }, (_, b) => (
              <rect key={b} x={150 + s * 360 + b * 58} y={22 + r * 150} width="50" height="58" fill={['#8a7454', '#6f5c42', '#9a8462'][(b + r + s) % 3]} opacity=".75" />
            ))}
          </g>
        )),
      )}
      <path d="M600 0v60" stroke="#111" strokeWidth="3" />
      <path d="M560 60h80l-14 28h-52z" fill="#3a5a3a" />
    </Interior>
  ),
  garden: () => (
    <>
      <NightSky id="garden" top="#121a18" bottom="#22302a" />
      <circle cx="1320" cy="140" r="54" fill="#e9e1cc" opacity=".7" />
      <path d="M0 520c60-60 130-70 200-30 60-70 160-60 210 10 60-40 140-20 170 30v470H0zM1100 540c60-70 150-60 200 0 50-50 140-40 180 20 40-10 80 0 120 30v410h-500z" fill="#1a2620" />
      <path d="M0 700h1600v300H0z" fill="#1f2a20" />
      {Array.from({ length: 30 }, (_, i) => {
        const x = (i * 157) % 1600;
        return <path key={i} d={`M${x} 1000c10-60 20-110 40-150M${x + 20} 1000c0-50 10-90 30-120`} stroke="#2f4127" strokeWidth="5" fill="none" />;
      })}
      <path d="M200 420c80-90 220-140 400-120" stroke="#2a221c" strokeWidth="14" fill="none" />
      <path d="M380 340c40 30 60 80 40 140M480 320c60 10 90 50 100 110" stroke="#2a221c" strokeWidth="8" fill="none" />
      <Leaves seed={7} color="#6a4a1c" />
      <Fog id="garden" y={600} />
    </>
  ),
  street: () => (
    <>
      <NightSky id="street" top="#18161f" bottom="#302a36" />
      <path d="M0 640V340l100-80 100 80v300zM220 640V360h260v280zM1340 640V300l130-90 130 90v340z" fill="#221d26" />
      <path d="M0 640h1600v360H0z" fill="#26222a" />
      <path d="M0 700h1600" stroke="#3a3440" strokeWidth="6" />
      <path d="M0 640h1600" stroke="#4a4450" strokeWidth="10" />
      {[300, 900, 1400].map((x) => (
        <g key={x}>
          <path d={`M${x} 640V440`} stroke="#0e0d11" strokeWidth="8" />
          <path d={`M${x - 14} 440h28l-6-20h-16z`} fill="#ffcf7a" />
          <ellipse cx={x} cy="760" rx="60" ry="10" fill="#ffc35c" opacity=".12" />
        </g>
      ))}
      {/* street sign: a linden leaf and house numbers, no words (the game is played in four languages) */}
      <rect x="40" y="560" width="200" height="44" rx="4" fill="#2f5d8a" opacity=".9" />
      <path d="M78 582c0-14 14-18 22-10 8-8 22-4 22 10 0 12-14 18-22 14-8 4-22-2-22-14z" fill="#9cc48a" />
      <path d="M100 572v24" stroke="#2f5d8a" strokeWidth="2" />
      <text x="180" y="590" fill="#f1ede2" fontSize="22" textAnchor="middle" fontFamily="monospace">9–17</text>
      <Leaves seed={5} />
      <Fog id="street" y={620} />
    </>
  ),
  house: () => (
    <Interior id="house" wall="#2b2a24" wall2="#1a1916" floor="#2c2418" floor2="#120e09" light="#e9d6a4" lightOpacity={0.22} lightX={1200}>
      <circle cx="1200" cy="200" r="110" fill="#14141a" />
      <circle cx="1200" cy="200" r="92" fill="#3a3a48" opacity=".5" />
      <path d="M1200 108v184M1108 200h184" stroke="#14141a" strokeWidth="10" />
      <path d="M1140 290l-300 700h720l-300-700z" fill="#e9d6a4" opacity=".05" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={1000 + ((i * 53) % 400)} cy={300 + ((i * 97) % 500)} r="2" fill="#e9d6a4" opacity=".35" className="dust" style={{ '--i': i }} />
      ))}
      <path d="M100 100c60 40 80 120 40 200M180 80c10 60 40 90 80 110" stroke="#3a3830" strokeWidth="3" fill="none" opacity=".6" />
      <rect x="60" y="520" width="360" height="180" fill="#3a2f22" />
      <path d="M60 520h360" stroke="#5a4a32" strokeWidth="8" />
    </Interior>
  ),
  hidden: () => (
    <Interior id="hidden" wall="#2a2026" wall2="#170f14" floor="#2a1c14" floor2="#100906" light="#ffb648" lightOpacity={0.3} lightX={800}>
      <rect x="380" y="560" width="840" height="30" fill="#4a2f1c" />
      <path d="M760 520v-60" stroke="#e9dfc8" strokeWidth="18" />
      <path d="M760 454c-6-14 2-22 0-34 10 10 10 22 0 34z" fill="#ffcf7a" className="flame" />
      <ellipse cx="760" cy="540" rx="40" ry="8" fill="#6a4a2a" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={120 + i * 40} y={120 + (i % 2) * 20} width="30" height="160" fill={['#5a2a24', '#2f3a27', '#3a3a52'][i % 3]} />
      ))}
      <rect x="100" y="280" width="270" height="12" fill="#4a2f1c" />
    </Interior>
  ),
};

export default function Backdrop({ scene }) {
  const S = SCENES[scene] ?? SCENES.archive;
  return (
    <svg className={`backdrop backdrop--${scene}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <S />
    </svg>
  );
}
