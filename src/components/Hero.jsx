import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─── IMPORTANT ────────────────────────────────────────────────────────────────
// Download the GeoJSON ONCE and save it locally so it never fails at runtime:
//
//   Windows (PowerShell):
//     Invoke-WebRequest -Uri "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson" -OutFile "src/data/india-states.geojson"
//
//   Mac / Linux:
//     curl -o src/data/india-states.geojson "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson"
//
// Then make sure your vite.config.js has:
//   import json from '@vitejs/plugin-json'   ← Vite supports JSON imports natively,
//                                               no plugin needed.
// ──────────────────────────────────────────────────────────────────────────────
import indiaGeoJSON from '../data/india-states.json';


const floatingCards = [
  {
    id: 'M02',
    label: 'Mandi Price · Nasik',
    value: '₹12–18/kg',
    sub: 'Tomato · 14-day ahead',
    badge: '↑ 74% confidence',
    badgeColor: 'text-emerald-400',
    className: 'float-1',
    pos: 'top-[22%] right-[6%]',
  },
  {
    id: 'M12',
    label: 'Wet-Bulb Risk · Delhi',
    value: '33.2°C',
    sub: 'Tomorrow 12:00–16:00',
    badge: '⚠ Danger threshold exceeded',
    badgeColor: 'text-red-400',
    className: 'float-2',
    pos: 'top-[52%] left-[4%]',
  },
  {
    id: 'M13',
    label: 'Hospital Surge Alert',
    value: '+280%',
    sub: 'AQI Severe · 48hr forecast',
    badge: '14 hospitals notified',
    badgeColor: 'text-blue-400',
    className: 'float-3',
    pos: 'bottom-[16%] right-[8%]',
  },
];

// Real lon/lat for major Indian cities
const CITIES = [
  { name: 'Delhi',      lon: 77.209,  lat: 28.614 },
  { name: 'Mumbai',     lon: 72.877,  lat: 19.076 },
  { name: 'Bengaluru',  lon: 77.594,  lat: 12.972 },
  { name: 'Kolkata',    lon: 88.363,  lat: 22.573 },
  { name: 'Chennai',    lon: 80.270,  lat: 13.083 },
  { name: 'Hyderabad',  lon: 78.474,  lat: 17.385 },
  { name: 'Ahmedabad',  lon: 72.587,  lat: 23.022 },
  { name: 'Patna',      lon: 85.137,  lat: 25.594 },
  { name: 'Jaipur',     lon: 75.788,  lat: 26.912 },
  { name: 'Lucknow',    lon: 80.946,  lat: 26.847 },
];

function StatePath({ d }) {
  const [hovered, setHovered] = useState(false);
  return (
    <path
      d={d}
      fill={hovered ? 'rgba(45,212,191,0.22)' : 'url(#stateFill)'}
      stroke="#2dd4bf"
      strokeWidth={0.75}
      strokeLinejoin="round"
      style={{ transition: 'fill 0.2s', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

function IndiaMap() {
  const containerRef = useRef(null);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function build() {
      const { geoMercator, geoPath } = await import('d3-geo');
      if (cancelled) return;

      const W = containerRef.current?.clientWidth  || 460;
      const H = containerRef.current?.clientHeight || 560;

      // fitExtent with padding ensures Kashmir (lat ~37°N) is never cropped
      const pad = Math.min(W, H) * 0.04;
      const projection = geoMercator().fitExtent(
        [[pad, pad], [W - pad, H - pad]],
        indiaGeoJSON           // ← full GeoJSON bounding box drives the fit
      );
      const pathGen = geoPath().projection(projection);

      const paths = indiaGeoJSON.features.map((feat, i) => ({
        key: i,
        d: pathGen(feat),
      }));

      const markers = CITIES.map(({ name, lon, lat }) => {
        const [cx, cy] = projection([lon, lat]);
        return { name, cx, cy };
      });

      if (!cancelled) setMapData({ paths, markers, W, H });
    }

    build();
    return () => { cancelled = true; };
  }, []);

  const W = mapData?.W ?? 460;
  const H = mapData?.H ?? 560;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="stateFill" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.03"/>
          </radialGradient>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <ellipse
          cx={W / 2} cy={H / 2}
          rx={W * 0.38} ry={H * 0.44}
          fill="url(#bgGlow)"
        />

        {/* Loading pulse */}
        {!mapData && (
          <g>
            <circle cx={W/2} cy={H/2} r="50" fill="none" stroke="#2dd4bf" strokeWidth="1" opacity="0.2">
              <animate attributeName="r"       from="50" to="90"  dur="1.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.3" to="0"  dur="1.6s" repeatCount="indefinite"/>
            </circle>
            <circle cx={W/2} cy={H/2} r="10" fill="#2dd4bf" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.2s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

        {/* State outlines */}
        {mapData && (
          <g filter="url(#glow)">
            {mapData.paths.map(({ key, d }) => (
              <StatePath key={key} d={d} />
            ))}
          </g>
        )}

        {/* City markers */}
        {mapData && mapData.markers.map(({ name, cx, cy }) => (
          <g key={name}>
            <circle cx={cx} cy={cy} r={9}   fill="none" stroke="#2dd4bf" strokeWidth={0.6} opacity={0.28}/>
            <circle cx={cx} cy={cy} r={2.8} fill="#2dd4bf" opacity={0.95} filter="url(#glow)"/>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Hero() {
  const [count, setCount] = useState({ modules: 0 });

  useEffect(() => {
    const t1 = setTimeout(() => {
      let n = 0;
      const i = setInterval(() => {
        n = Math.min(n + 1, 20);
        setCount(c => ({ ...c, modules: n }));
        if (n >= 20) clearInterval(i);
      }, 60);
    }, 800);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section className="relative min-h-screen flex overflow-hidden hero-mesh grid-overlay">

      <div className="watermark">
        <span>BharatSense</span>
      </div>

      {/* Left panel */}
      <div className="relative z-10 flex flex-col justify-end px-10 pb-16 pt-28 w-full lg:w-1/2">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-px bg-teal-400"/>
          <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">
            Predictive Intelligence Platform · India
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-normal mb-8"
          style={{ color: 'var(--text-heading)' }}
        >
          Predict<br />
          <em className="gradient-text not-italic">Before</em><br />
          It Breaks.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-base leading-relaxed max-w-[38ch] mb-10 font-light"
          style={{ color: 'var(--text-muted)' }}
        >
          20 production ML modules delivering early warnings to 600 million Indians —
          farmers, women, workers, and communities — before crisis strikes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center gap-4 mb-14"
        >
          <a
            href="#platform"
            className="flex items-center gap-2.5 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-[#020b18] text-sm font-body font-500 tracking-widest uppercase transition-all duration-300 teal-glow"
            style={{ cursor: 'none' }}
          >
            Explore Platform
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </a>
          <a
            href="#impact"
            className="flex items-center gap-2.5 px-7 py-3.5 text-sm border border-[rgba(45,212,191,0.15)] hover:border-[rgba(45,212,191,0.35)] transition-all duration-300 font-body tracking-widest uppercase"
            style={{ color: 'var(--text-primary)', cursor: 'none' }}
          >
            See Impact
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-10 pt-8"
          style={{ borderTop: '1px solid rgba(45,212,191,0.1)' }}
        >
          {[
            { num: `${count.modules}`, label: 'ML Modules',    suffix: '' },
            { num: '6',               label: 'Domains',        suffix: '' },
            { num: '600M',            label: 'People Reached', suffix: '+' },
            { num: '100%',            label: 'Open Source',    suffix: '' },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-display text-2xl leading-none" style={{ color: 'var(--text-heading)' }}>
                {s.num}<span className="text-teal-400">{s.suffix}</span>
              </div>
              <div className="text-[0.65rem] tracking-widest uppercase mt-1.5 font-body" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 overflow-hidden">

        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '5% 8%' }}>
          <IndiaMap />
        </div>

        {floatingCards.map((card, i) => (
          <motion.div
            key={card.id}
            className={`absolute ${card.pos} glass p-4 min-w-[170px] ${card.className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1 + i * 0.25 }}
          >
            <div className="font-mono text-[0.6rem] text-teal-400 tracking-widest mb-1.5">
              {card.id} · {card.label}
            </div>
            <div className="font-display text-2xl leading-none mb-1" style={{ color: 'var(--text-heading)' }}>
              {card.value}
            </div>
            <div className="font-body text-[0.68rem] mb-2" style={{ color: 'var(--text-muted)' }}>
              {card.sub}
            </div>
            <div className={`font-mono text-[0.6rem] ${card.badgeColor} bg-[rgba(255,255,255,0.05)] px-2 py-0.5 inline-block`}>
              {card.badge}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-8 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"/>
          <div>
            <div className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Pipeline Active
            </div>
            <div className="w-28 h-px mt-1 relative overflow-hidden" style={{ background: 'rgba(45,212,191,0.15)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 bg-teal-400"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}
      />
    </section>
  );
}