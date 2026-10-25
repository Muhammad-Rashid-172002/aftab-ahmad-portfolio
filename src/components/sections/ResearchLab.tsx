import { motion } from 'motion/react';
import { FlaskConical, Info, RotateCcw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { researchModel } from '../../data/profile';
import { BASE, evaluate, Q_EFF, R_EQ } from '../../lib/wptModel';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { Reveal, SectionHeading } from '../ui/primitives';
import { Live, useLive } from '../ui/Live';

function spiral(cx: number, cy: number, rx: number, ry: number, turns: number) {
  const steps = turns * 40;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const s = 1 - 0.72 * t;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * s).toFixed(1)} ${(cy + Math.sin(a) * ry * s).toFixed(1)} `;
  }
  return d;
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-silver-300">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm tabular-nums text-silver-50">
          {value}
          <span className="text-silver-500"> {unit}</span>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-700 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink-950 [&::-webkit-slider-thumb]:bg-signal [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(79,216,235,.2)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink-950 [&::-moz-range-thumb]:bg-signal"
        style={{ background: `linear-gradient(to right, #4fd8eb ${pct}%, #111d2f ${pct}%)` }}
        aria-describedby={hint ? `${id}-h` : undefined}
      />
      {hint && (
        <p id={`${id}-h`} className="mt-1.5 text-[11px] text-silver-500">
          {hint}
        </p>
      )}
    </div>
  );
}

function Gauge({ label, value, display, tone = 'signal' }: { label: string; value: number; display: string; tone?: 'signal' | 'teal' }) {
  return (
    <div className="rounded-xl border border-line bg-ink-950/60 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">{label}</div>
      <div className="mt-1 font-mono text-2xl tabular-nums text-silver-50">{display}</div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700">
        <motion.div
          className={`h-full rounded-full ${tone === 'teal' ? 'bg-teal' : 'bg-signal'}`}
          animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}

function Pulses({ children }: { children: (live: boolean) => React.ReactNode }) {
  return <>{children(useLive())}</>;
}

export function ResearchLab() {
  const reduced = usePrefersReducedMotion();
  const [d, setD] = useState<number>(BASE.d0);
  const [theta, setTheta] = useState<number>(0);
  const [f, setF] = useState<number>(BASE.f0);
  const r = useMemo(() => evaluate(d, theta, f), [d, theta, f]);
  const atBaseline = d === BASE.d0 && theta === 0 && f === BASE.f0;

  // Geometry for the visual
  const W = 560;
  const txY = 92;
  const rxY = txY + 40 + d * 5.2;
  const H = 440;
  const strength = Math.min(1, r.k / 0.6);
  const lines = 6;

  return (
    <section id="research" aria-labelledby="research-title" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(43,184,166,.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="research-title"
          index="07"
          eyebrow="Academic Research Lab · UET Mardan"
          title="Powering the Next Generation of Implantable Devices"
          lead={
            <>
              {researchModel.title}. Adjust the link geometry and excitation frequency to see how coupling and efficiency respond in a simplified analytical model.
            </>
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12 [&>*]:min-w-0">
          {/* Visual */}
          <Reveal className="lg:col-span-7">
            <Live className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver-400">
                  <FlaskConical className="h-3.5 w-3.5 text-teal" aria-hidden /> Inductive link model
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-warn">Educational visualization</span>
              </div>
              <div className="hairline-grid">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Coil link at ${d} millimetres separation and ${theta} degrees misalignment; coupling factor ${r.k.toFixed(3)}`}>
                  {/* Tissue */}
                  <rect x="0" y={txY + 26} width={W} height={H - txY - 26} fill="rgba(43,184,166,.05)" />
                  <line x1="0" x2={W} y1={txY + 26} y2={txY + 26} stroke="#2bb8a6" strokeOpacity=".4" strokeDasharray="2 6" />
                  <text x="16" y={txY + 44} fontSize="10" className="font-mono" fill="#2bb8a6">TISSUE</text>

                  {/* Field lines */}
                  {Array.from({ length: lines }).map((_, i) => {
                    const w = 40 + i * 28;
                    const op = (0.55 - i * 0.07) * (0.25 + strength * 0.9);
                    const sag = rxY + 40 + i * 6;
                    return (
                      <path
                        key={i}
                        d={`M${W / 2 - w} ${txY} C ${W / 2 - w - 30} ${(txY + sag) / 2}, ${W / 2 - w * 0.4} ${sag}, ${W / 2} ${sag} S ${W / 2 + w + 30} ${(txY + sag) / 2}, ${W / 2 + w} ${txY}`}
                        fill="none"
                        stroke="#4fd8eb"
                        strokeOpacity={Math.max(0.04, op)}
                        strokeDasharray="4 8"
                        className={reduced ? '' : 'animate-dash'}
                        style={{ animationDuration: `${2.4 / (0.3 + r.eta)}s` }}
                      />
                    );
                  })}

                  {/* Tx coil */}
                  <g>
                    <ellipse cx={W / 2} cy={txY} rx="140" ry="22" fill="rgba(217,163,91,.06)" />
                    <path d={spiral(W / 2, txY, 138, 22, 7)} fill="none" stroke="#d9a35b" strokeWidth="1.8" />
                    <text x={W / 2 + 150} y={txY + 4} fontSize="11" className="font-mono" fill="#aab7c8">TX</text>
                  </g>

                  {/* Rx coil (implant) */}
                  <motion.g animate={{ rotate: theta }} style={{ originX: `${W / 2}px`, originY: `${rxY}px` }} transition={{ type: 'spring', stiffness: 160, damping: 22 }}>
                    <rect x={W / 2 - 92} y={rxY - 22} width="184" height="44" rx="22" fill="rgba(3,5,10,.75)" stroke="rgba(148,178,214,.25)" />
                    <path d={spiral(W / 2, rxY, 80, 13, 5)} fill="none" stroke="#d9a35b" strokeWidth="1.6" />
                  </motion.g>
                  <text x={W / 2 + 110} y={rxY + 4} fontSize="11" className="font-mono" fill="#aab7c8">RX · IMPLANT</text>

                  {/* Distance dimension */}
                  <g stroke="#9be8f3" strokeOpacity=".6">
                    <line x1="64" x2="64" y1={txY} y2={rxY} />
                    <line x1="56" x2="72" y1={txY} y2={txY} />
                    <line x1="56" x2="72" y1={rxY} y2={rxY} />
                  </g>
                  <text x="78" y={(txY + rxY) / 2 + 4} fontSize="11" className="font-mono" fill="#9be8f3">
                    {d} mm
                  </text>

                  {/* Energy pulses */}
                  <Pulses>{(live) => live &&
                    [0, 0.5, 1].map((delay) => (
                      <motion.circle
                        key={delay}
                        cx={W / 2}
                        r={3.5}
                        fill="#c9f6fc"
                        animate={{ cy: [txY + 6, rxY - 6], opacity: [0, r.eta, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay, ease: 'easeInOut' }}
                      />
                    ))}</Pulses>
                </svg>
              </div>

              {/* Resonant circuit */}
              <div className="border-t border-line p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">Resonant circuit · series-tuned (schematic)</div>
                <svg viewBox="0 0 560 110" className="mt-2 w-full" role="img" aria-label="Resonant circuit: source, capacitor and transmitter coil coupled to receiver coil, capacitor and load">
                  <g fill="none" stroke="#aab7c8" strokeWidth="1.4">
                    {/* Tx loop */}
                    <circle cx="50" cy="55" r="16" />
                    <path d="M42 55 q4 -8 8 0 q4 8 8 0" />
                    <path d="M50 39 V20 H120 M130 20 H210 V36" />
                    <path d="M120 10 V30 M130 10 V30" />
                    <path d="M210 36 q10 6 0 12 q10 6 0 12 q10 6 0 12" stroke="#d9a35b" />
                    <path d="M210 72 V90 H50 V71" />
                    {/* Rx loop */}
                    <path d="M350 36 q-10 6 0 12 q-10 6 0 12 q-10 6 0 12" stroke="#d9a35b" />
                    <path d="M350 36 V20 H420 M430 20 H500 V40" />
                    <path d="M420 10 V30 M430 10 V30" />
                    <rect x="492" y="40" width="16" height="30" />
                    <path d="M500 70 V90 H350 V72" />
                  </g>
                  {/* Coupling */}
                  <line x1="230" y1="55" x2="330" y2="55" stroke="#4fd8eb" strokeOpacity={0.2 + strength * 0.8} strokeWidth={1 + strength * 3} strokeDasharray="3 5" className={reduced ? '' : 'animate-dash'} />
                  <text x="280" y="44" textAnchor="middle" fontSize="11" className="font-mono" fill="#9be8f3">
                    k = {r.k.toFixed(3)}
                  </text>
                  <text x="125" y="48" textAnchor="middle" fontSize="10" className="font-mono" fill="#8494aa">C₁</text>
                  <text x="425" y="48" textAnchor="middle" fontSize="10" className="font-mono" fill="#8494aa">C₂</text>
                  <text x="520" y="60" fontSize="10" className="font-mono" fill="#8494aa">R_L</text>
                  <text x="50" y="106" textAnchor="middle" fontSize="10" className="font-mono" fill="#8494aa">{f} kHz</text>
                  {/* current markers */}
                  <Pulses>{(live) => live && (
                    <>
                      <motion.circle r="3" fill="#9be8f3" animate={{ cx: [50, 120, 210, 210, 50, 50], cy: [20, 20, 20, 90, 90, 20] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                      <motion.circle r="3" fill="#2bb8a6" opacity={0.3 + r.eta * 0.7} animate={{ cx: [350, 420, 500, 500, 350, 350], cy: [20, 20, 20, 90, 90, 20] }} transition={{ duration: 3 / (0.3 + r.eta), repeat: Infinity, ease: 'linear' }} />
                    </>
                  )}</Pulses>
                </svg>
              </div>
            </Live>
          </Reveal>

          {/* Controls + readouts */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver-400">Controls</h3>
                <button
                  type="button"
                  onClick={() => {
                    setD(BASE.d0);
                    setTheta(0);
                    setF(BASE.f0);
                  }}
                  disabled={atBaseline}
                  className="btn btn-ghost !min-h-[36px] !px-3 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
                </button>
              </div>
              <div className="mt-5 space-y-6">
                <Slider label="Coil separation" unit="mm" value={d} min={5} max={40} step={1} onChange={setD} hint="Baseline 14 mm" />
                <Slider label="Angular misalignment" unit="°" value={theta} min={0} max={75} step={1} onChange={setTheta} hint="Baseline 0°" />
                <Slider label="Excitation frequency" unit="kHz" value={f} min={250} max={650} step={1} onChange={setF} hint="Tanks tuned to 433 kHz" />
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-2 gap-3" delay={0.05}>
              <Gauge label="Coupling factor k" value={r.k / 0.6} display={r.k.toFixed(3)} />
              <Gauge label="Model efficiency η" value={r.eta} display={`${(r.eta * 100).toFixed(1)}%`} tone="teal" />
              <Gauge label="Relative coupling" value={Math.min(1, r.relCoupling / 1.6)} display={`${(r.relCoupling * 100).toFixed(0)}%`} />
              <Gauge label="Tank response" value={r.tank} display={`${(r.tank * 100).toFixed(0)}%`} tone="teal" />
            </Reveal>
          </div>
        </div>

        {/* Supplied parameters + assumptions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 [&>*]:min-w-0">
          <Reveal className="panel p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver-400">Supplied research-model values · baseline</h3>
              <span className={`chip ${atBaseline ? '!border-teal/50 !text-teal' : ''}`}>{atBaseline ? 'Model at baseline' : 'Model adjusted'}</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {[
                ['Resonance', `${researchModel.frequencyKHz} kHz`],
                ['Separation', `${researchModel.separationMm} mm`],
                ['Misalignment', `${researchModel.misalignmentDeg}°`],
                ['Coupling k', researchModel.coupling.toFixed(3)],
                ['Reported efficiency', `${researchModel.efficiency * 100}%`],
                ['Reported SAR index', researchModel.sar],
                ['Reported thermal rise', researchModel.thermal],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-silver-500">{k}</dt>
                  <dd className="mt-0.5 font-mono text-silver-50">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-silver-500">
              SAR and thermal figures are the reported values for the baseline configuration. This visualization does not compute tissue absorption or heating, so they are not updated when the controls change.
            </p>
          </Reveal>
          <Reveal className="rounded-[var(--radius-panel)] border border-line p-6 lg:col-span-5" delay={0.05}>
            <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-silver-400">
              <Info className="h-3.5 w-3.5" aria-hidden /> Model assumptions
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-silver-400">
              <li>k(d) = (1 + (d/r)²)^(−3/2) with equivalent radius r ≈ {R_EQ.toFixed(1)} mm, fitted so k(14 mm) = 0.372.</li>
              <li>Misalignment applied as k·cos θ (small-coil approximation).</li>
              <li>η = U²/(1 + √(1+U²))², U = k·√(Q₁Q₂), with √(Q₁Q₂) ≈ {Q_EFF.toFixed(1)} fitted to 88 % at baseline.</li>
              <li>Off-resonance drive scaled by a normalised tank response, loaded Q = 10 assumed.</li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <p className="rounded-2xl border border-warn/30 bg-warn/[0.05] p-4 text-sm leading-relaxed text-silver-200" role="note">
            <strong className="font-semibold text-warn">Academic disclaimer — </strong>
            {researchModel.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
