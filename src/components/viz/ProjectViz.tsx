import { motion } from 'motion/react';
import { Hotspot } from './Hotspot';
import { useLive } from '../ui/Live';

export interface VizProps {
  active: string;
  onSelect: (id: string) => void;
  labels: Record<string, string>;
}

const C = { signal: '#4fd8eb', soft: '#9be8f3', teal: '#2bb8a6', silver: '#aab7c8', line: 'rgba(148,178,214,.22)', dim: 'rgba(148,178,214,.10)' };

/** Ellipse-projected planar spiral. */
function spiralPath(cx: number, cy: number, rOuter: number, rInner: number, turns: number, squash = 0.32) {
  const steps = turns * 48;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = rOuter - (rOuter - rInner) * t;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * squash;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

const glow = (on: boolean) => (on ? 'drop-shadow(0 0 6px rgba(79,216,235,.8))' : undefined);

/* ===================================================================== */
/*  01 — Inductive WPT                                                    */
/* ===================================================================== */
export function CoilViz({ active, onSelect, labels }: VizProps) {
  const live = useLive();
  const txY = 150;
  const rxY = 300;
  const fieldLines = [60, 95, 130, 165];
  return (
    <svg viewBox="0 0 640 440" className="h-full w-full" role="group" aria-label="Diagram of transmitter and implanted receiver coils with magnetic flux lines">
      <defs>
        <linearGradient id="tissue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2bb8a6" stopOpacity="0.10" />
          <stop offset="1" stopColor="#2bb8a6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Tissue layers */}
      <rect x="0" y="205" width="640" height="235" fill="url(#tissue)" />
      <line x1="0" y1="205" x2="640" y2="205" stroke={C.teal} strokeOpacity=".45" strokeDasharray="2 6" />
      <text x="20" y="224" fontSize="10" className="font-mono" fill={C.teal} fillOpacity=".8">SKIN / TISSUE</text>
      <text x="20" y="190" fontSize="10" className="font-mono" fill={C.silver} fillOpacity=".6">EXTERNAL</text>

      {/* Flux lines */}
      {fieldLines.map((w, i) => (
        <g key={w}>
          <motion.path
            d={`M${320 - w} ${txY} C ${320 - w - 70} ${txY - 120}, ${320 + w + 70} ${txY - 120}, ${320 + w} ${txY}`}
            fill="none"
            stroke={C.signal}
            strokeOpacity={0.35 - i * 0.06}
            strokeDasharray="4 8"
            className="animate-dash"
          />
          <motion.path
            d={`M${320 - w} ${txY} C ${320 - w - 40} ${rxY - 40}, ${320 - w * 0.5} ${rxY + 60}, 320 ${rxY + 40} S ${320 + w + 40} ${rxY - 40}, ${320 + w} ${txY}`}
            fill="none"
            stroke={C.signal}
            strokeOpacity={0.4 - i * 0.07}
            strokeDasharray="4 8"
            className="animate-dash"
            style={{ animationDirection: 'reverse' }}
          />
        </g>
      ))}

      {/* Energy pulses travelling Tx → Rx */}
      {live && [0, 0.6, 1.2].map((d) => (
        <motion.circle
          key={d}
          cx={320}
          r={4}
          fill={C.soft}
          initial={{ cy: txY + 10, opacity: 0 }}
          animate={{ cy: [txY + 10, rxY - 10], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: 'easeInOut' }}
        />
      ))}

      {/* Tx coil */}
      <g style={{ filter: glow(active === 'tx') }}>
        <ellipse cx="320" cy={txY} rx="150" ry="48" fill="rgba(79,216,235,.04)" stroke={C.line} />
        <path d={spiralPath(320, txY, 142, 40, 7)} fill="none" stroke="#d9a35b" strokeWidth={2} strokeOpacity={0.9} />
      </g>

      {/* Implant capsule + Rx coil */}
      <g style={{ filter: glow(active === 'rx') }}>
        <rect x="230" y={rxY - 36} width="180" height="72" rx="36" fill="rgba(3,5,10,.6)" stroke={C.line} />
        <path d={spiralPath(320, rxY, 72, 22, 5)} fill="none" stroke="#d9a35b" strokeWidth={1.6} />
        <rect x="392" y={rxY - 10} width="34" height="20" rx="4" fill="#111d2f" stroke={C.line} />
        <text x="409" y={rxY + 4} textAnchor="middle" fontSize="8" className="font-mono" fill={C.silver}>
          STIM
        </text>
      </g>

      {/* Gap dimension */}
      <g stroke={active === 'gap' ? C.soft : C.silver} strokeOpacity={active === 'gap' ? 1 : 0.5}>
        <line x1="520" y1={txY} x2="520" y2={rxY} />
        <line x1="512" y1={txY} x2="528" y2={txY} />
        <line x1="512" y1={rxY} x2="528" y2={rxY} />
      </g>
      <text x="534" y={(txY + rxY) / 2 + 4} fontSize="11" className="font-mono" fill={C.silver}>
        d
      </text>

      {/* Angle indicator */}
      <g stroke={active === 'angle' ? C.soft : C.silver} strokeOpacity={active === 'angle' ? 1 : 0.5} fill="none">
        <line x1="150" y1={rxY} x2="230" y2={rxY} strokeDasharray="3 4" />
        <line x1="150" y1={rxY} x2="226" y2={rxY - 22} />
        <path d={`M196 ${rxY} A 46 46 0 0 0 194 ${rxY - 13}`} />
      </g>
      <text x="162" y={rxY - 10} fontSize="11" className="font-mono" fill={C.silver}>
        θ
      </text>

      {/* Resonant tank inset */}
      <g transform="translate(470 330)" stroke={active === 'tank' ? C.soft : C.silver} strokeOpacity={active === 'tank' ? 1 : 0.6} fill="none" strokeWidth={1.4}>
        <rect x="0" y="0" width="140" height="80" rx="10" stroke={C.line} />
        <path d="M20 20 H50 M50 12 V28 M56 12 V28 M56 20 H86" />
        <path d="M86 20 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0" />
        <path d="M20 20 V60 H122 V20" />
        <text x="70" y="52" textAnchor="middle" fontSize="9" className="font-mono" fill={C.silver} stroke="none">
          C ∥ L — tuned
        </text>
      </g>

      <Hotspot x={470} y={txY - 30} label={labels.tx} active={active === 'tx'} onSelect={() => onSelect('tx')} />
      <Hotspot x={250} y={rxY + 60} label={labels.rx} active={active === 'rx'} onSelect={() => onSelect('rx')} labelSide="left" />
      <Hotspot x={520} y={(txY + rxY) / 2 + 30} label={labels.gap} active={active === 'gap'} onSelect={() => onSelect('gap')} labelSide="bottom" />
      <Hotspot x={150} y={rxY} label={labels.angle} active={active === 'angle'} onSelect={() => onSelect('angle')} labelSide="bottom" />
      <Hotspot x={540} y={330} label={labels.tank} active={active === 'tank'} onSelect={() => onSelect('tank')} labelSide="top" />
    </svg>
  );
}

/* ===================================================================== */
/*  02 — Microwave link                                                   */
/* ===================================================================== */
function LatticeTower({ x, base, h, w }: { x: number; base: number; h: number; w: number }) {
  const segs = 8;
  let d = `M${x - w} ${base} L${x - w * 0.35} ${base - h} M${x + w} ${base} L${x + w * 0.35} ${base - h}`;
  for (let i = 0; i < segs; i++) {
    const y0 = base - (h / segs) * i;
    const y1 = base - (h / segs) * (i + 1);
    const w0 = w - (w * 0.65 * i) / segs;
    const w1 = w - (w * 0.65 * (i + 1)) / segs;
    d += ` M${x - w0} ${y0} L${x + w1} ${y1} M${x + w0} ${y0} L${x - w1} ${y1} M${x - w1} ${y1} H${x + w1}`;
  }
  return <path d={d} fill="none" stroke={C.silver} strokeOpacity={0.55} strokeWidth={1} />;
}

export function LinkViz({ active, onSelect, labels }: VizProps) {
  const live = useLive();
  const A = { x: 108, y: 112 };
  const B = { x: 532, y: 126 };
  return (
    <svg viewBox="0 0 640 440" className="h-full w-full" role="group" aria-label="Microwave link between two towers with antennas, radio units, indoor units and Fresnel zone">
      {/* Terrain */}
      <path d="M0 380 C 110 360, 180 372, 250 350 S 380 330, 430 352 S 560 370, 640 360 V440 H0Z" fill="#0a1524" />
      <path d="M0 380 C 110 360, 180 372, 250 350 S 380 330, 430 352 S 560 370, 640 360" fill="none" stroke={C.line} />
      {/* Obstacle */}
      <g opacity={0.8}>
        <rect x="318" y="292" width="34" height="58" fill="#111d2f" stroke={C.line} />
        <text x="335" y="285" textAnchor="middle" fontSize="9" className="font-mono" fill={C.silver} fillOpacity=".7">OBSTACLE</text>
      </g>

      {/* Fresnel zone */}
      <motion.ellipse
        cx={(A.x + B.x) / 2}
        cy={(A.y + B.y) / 2}
        rx={(B.x - A.x) / 2}
        ry={46}
        transform={`rotate(${(Math.atan2(B.y - A.y, B.x - A.x) * 180) / Math.PI} ${(A.x + B.x) / 2} ${(A.y + B.y) / 2})`}
        fill={active === 'path' ? 'rgba(79,216,235,.08)' : 'rgba(79,216,235,.03)'}
        stroke={C.signal}
        strokeOpacity={active === 'path' ? 0.7 : 0.3}
        strokeDasharray="5 6"
      />
      <text x="320" y="196" textAnchor="middle" fontSize="9" className="font-mono" fill={C.signal} fillOpacity=".8">1ST FRESNEL ZONE — KEEP CLEAR</text>

      {/* Beam */}
      <line x1={A.x + 14} y1={A.y} x2={B.x - 14} y2={B.y} stroke={C.soft} strokeWidth={1.4} strokeDasharray="6 8" className="animate-dash" />
      {live && [0, 1].map((k) => (
        <motion.circle
          key={k}
          r={4}
          fill={k ? C.teal : C.soft}
          initial={false}
          animate={{ cx: k ? [B.x - 14, A.x + 14] : [A.x + 14, B.x - 14], cy: k ? [B.y, A.y] : [A.y, B.y] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', delay: k * 1.3 }}
        />
      ))}

      {/* Towers */}
      <LatticeTower x={90} base={384} h={290} w={26} />
      <LatticeTower x={550} base={368} h={262} w={24} />

      {/* Antennas + ODUs */}
      {[A, B].map((p, i) => {
        const dir = i === 0 ? 1 : -1;
        return (
          <g key={i} style={{ filter: glow(active === 'dish' || active === 'odu') }}>
            <path d={`M${p.x} ${p.y - 26} Q ${p.x + dir * 18} ${p.y} ${p.x} ${p.y + 26}`} fill="#dfe6ef" fillOpacity=".9" stroke="#fff" strokeOpacity=".6" />
            <rect x={i === 0 ? p.x - 22 : p.x + 4} y={p.y - 12} width="18" height="24" rx="3" fill={active === 'odu' ? '#4fd8eb' : '#58677a'} />
          </g>
        );
      })}

      {/* IF cable down tower A to shelter */}
      <path
        d={`M${A.x - 13} ${A.y + 12} V 340 H 150 V 360`}
        fill="none"
        stroke={active === 'if' ? C.soft : '#d9a35b'}
        strokeWidth={active === 'if' ? 2.4 : 1.6}
        strokeOpacity={0.9}
      />
      {/* Equipment shelter with IDU */}
      <g>
        <rect x="132" y="356" width="64" height="34" rx="3" fill="#0b1422" stroke={C.line} />
        <rect x="142" y="366" width="44" height="8" rx="1.5" fill={active === 'idu' ? '#4fd8eb' : '#1a2a41'} />
        <rect x="142" y="377" width="44" height="6" rx="1.5" fill="#1a2a41" />
        <text x="164" y="404" textAnchor="middle" fontSize="9" className="font-mono" fill={C.silver} fillOpacity=".8">RTN IDU</text>
      </g>

      <text x={A.x - 10} y={A.y - 44} fontSize="10" className="font-mono" fill={C.silver}>SITE A</text>
      <text x={B.x - 20} y={B.y - 44} fontSize="10" className="font-mono" fill={C.silver}>SITE B</text>

      <Hotspot x={164} y={330} label={labels.idu} active={active === 'idu'} onSelect={() => onSelect('idu')} labelSide="right" />
      <Hotspot x={A.x - 13} y={250} label={labels.if} active={active === 'if'} onSelect={() => onSelect('if')} labelSide="right" />
      <Hotspot x={A.x - 13} y={A.y + 40} label={labels.odu} active={active === 'odu'} onSelect={() => onSelect('odu')} labelSide="right" />
      <Hotspot x={B.x + 4} y={B.y - 30} label={labels.dish} active={active === 'dish'} onSelect={() => onSelect('dish')} labelSide="left" />
      <Hotspot x={335} y={150} label={labels.path} active={active === 'path'} onSelect={() => onSelect('path')} labelSide="top" />
    </svg>
  );
}

/* ===================================================================== */
/*  03 — Exploded telecom site                                            */
/* ===================================================================== */
export function SiteViz({ active, onSelect, labels }: VizProps) {
  const hl = (id: string) => (active === id ? C.soft : C.silver);
  return (
    <svg viewBox="0 0 640 440" className="h-full w-full" role="group" aria-label="Exploded view of a telecom site: sector antennas, RRUs, fiber and power runs, BBU cabinet and grounding">
      {/* Isometric ground plate */}
      <path d="M90 360 L320 290 L560 360 L320 430 Z" fill="#0a1524" stroke={C.line} />
      {/* Tower mast */}
      <path d="M300 360 L314 70 M340 360 L326 70" stroke={C.silver} strokeOpacity=".55" fill="none" />
      {Array.from({ length: 9 }).map((_, i) => {
        const y0 = 360 - i * 32;
        const y1 = y0 - 32;
        const w0 = 20 - i * 1.4;
        const w1 = 20 - (i + 1) * 1.4;
        return <path key={i} d={`M${320 - w0} ${y0} L${320 + w1} ${y1} M${320 + w0} ${y0} L${320 - w1} ${y1}`} stroke={C.silver} strokeOpacity=".25" />;
      })}

      {/* Exploded sector antennas */}
      {[
        { x: 210, y: 70, label: 'S1 · 0°' },
        { x: 320, y: 40, label: 'S2 · 120°' },
        { x: 430, y: 70, label: 'S3 · 240°' },
      ].map((s, i) => (
        <motion.g key={i} viewport={{ once: true }} initial={{ opacity: 0, x: (320 - s.x) * 0.6, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}>
          <line x1={s.x} y1={s.y + 50} x2={320} y2={96} stroke={C.dim} strokeDasharray="3 4" />
          <rect x={s.x - 12} y={s.y} width="24" height="70" rx="4" fill="#dfe6ef" fillOpacity={active === 'sectors' ? 1 : 0.8} style={{ filter: glow(active === 'sectors') }} />
          <text x={s.x} y={s.y - 8} textAnchor="middle" fontSize="9" className="font-mono" fill={C.silver}>
            {s.label}
          </text>
          {/* RRU beneath each sector */}
          <rect x={s.x - 14} y={s.y + 90} width="28" height="34" rx="3" fill={active === 'rru' ? '#4fd8eb' : '#58677a'} />
          <path d={`M${s.x} ${s.y + 70} V ${s.y + 90}`} stroke="#d9a35b" strokeWidth={1.6} />
        </motion.g>
      ))}

      {/* Fiber + power trunk */}
      <motion.path
        d="M210 194 C 210 240, 300 220, 300 260 M320 164 V 270 M430 194 C 430 240, 340 220, 340 260 M300 260 V 330 L 440 362 M340 260 V 320 L 448 352"
        fill="none"
        stroke={hl('fiber')}
        strokeWidth={active === 'fiber' ? 2 : 1.2}
        strokeDasharray="5 6"
        className="animate-dash"
      />

      {/* Cabinet with BBU (exploded open) */}
      <motion.g initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}>
        <path d="M440 300 L510 280 L560 296 L490 316 Z" fill="#111d2f" stroke={C.line} />
        <path d="M440 300 L490 316 V 386 L440 370 Z" fill="#0b1422" stroke={C.line} />
        <path d="M490 316 L560 296 V 366 L490 386 Z" fill="#08101b" stroke={C.line} />
        <path d="M498 326 L552 310 V 322 L498 338 Z" fill={active === 'bbu' ? '#4fd8eb' : '#1a2a41'} />
        <path d="M498 344 L552 328 V 336 L498 352 Z" fill="#1a2a41" />
        <text x="525" y="408" textAnchor="middle" fontSize="9" className="font-mono" fill={C.silver}>CABINET · BBU</text>
      </motion.g>

      {/* Grounding */}
      <g stroke={hl('ground')} strokeWidth={1.4} fill="none">
        <path d="M150 340 H 296 M160 340 V 360 M150 360 H170 M154 366 H166 M158 372 H162" />
      </g>
      <text x="150" y="330" fontSize="9" className="font-mono" fill={C.silver}>EARTH BAR</text>

      {/* ISDP record */}
      <g transform="translate(80 200)">
        <rect width="78" height="96" rx="8" fill="#0b1422" stroke={active === 'isdp' ? C.soft : C.line} />
        {[18, 34, 50, 66].map((y) => (
          <g key={y}>
            <rect x="10" y={y} width="8" height="8" rx="2" fill="none" stroke={C.teal} />
            <path d={`M12 ${y + 4} l2 2 l3 -4`} stroke={C.teal} fill="none" />
            <rect x="24" y={y + 2} width="42" height="4" rx="2" fill={C.dim} />
          </g>
        ))}
        <text x="39" y="12" textAnchor="middle" fontSize="8" className="font-mono" fill={C.silver}>ISDP</text>
      </g>

      <Hotspot x={430} y={50} label={labels.sectors} active={active === 'sectors'} onSelect={() => onSelect('sectors')} labelSide="right" />
      <Hotspot x={210} y={177} label={labels.rru} active={active === 'rru'} onSelect={() => onSelect('rru')} labelSide="left" />
      <Hotspot x={380} y={232} label={labels.fiber} active={active === 'fiber'} onSelect={() => onSelect('fiber')} labelSide="right" />
      <Hotspot x={525} y={300} label={labels.bbu} active={active === 'bbu'} onSelect={() => onSelect('bbu')} labelSide="top" />
      <Hotspot x={230} y={340} label={labels.ground} active={active === 'ground'} onSelect={() => onSelect('ground')} labelSide="bottom" />
      <Hotspot x={119} y={310} label={labels.isdp} active={active === 'isdp'} onSelect={() => onSelect('isdp')} labelSide="bottom" />
    </svg>
  );
}
