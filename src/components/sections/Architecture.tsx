import { AnimatePresence, motion, useInView } from 'motion/react';
import { Antenna, ArrowRightLeft, Cable, Network, Radio, RotateCcw, Server, TriangleAlert, Waves, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { antennaReference, chainNodes } from '../../data/profile';
import type { ChainNode } from '../../types/portfolio';
import { ease } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { Reveal, SectionHeading } from '../ui/primitives';
import { useScrollTo } from '../../lib/smoothScroll';

type Mode = 'transmit' | 'receive' | 'degrade' | 'restore';

const iconFor = (n: ChainNode) =>
  ({ IDU: Server, IF: Cable, ODU: Radio, ANT: Antenna, PATH: Waves, NET: Network } as const)[n.short as 'IDU'] ?? Wifi;

const modes: { id: Mode; label: string }[] = [
  { id: 'transmit', label: 'Transmission' },
  { id: 'receive', label: 'Reception' },
  { id: 'degrade', label: 'Degradation' },
  { id: 'restore', label: 'Restoration' },
];

/** Illustrative RSL values per mode — explicitly not measured data. */
const rslFor: Record<Mode, number> = { transmit: -42, receive: -42, degrade: -67, restore: -42 };

/* ------------------------------------------------ Aperture calculator */
function ApertureCalculator() {
  const [d, setD] = useState(0.6);
  const [f, setF] = useState(23);
  const eta = 0.55;
  const lambda = 0.299792458 / f; // metres (f in GHz)
  const gain = 10 * Math.log10(eta * Math.pow((Math.PI * d) / lambda, 2));
  const bw = (70 * lambda) / d;
  return (
    <div className="rounded-xl border border-line bg-ink-950/50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Aperture estimate</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-warn">Theoretical</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-silver-400">
          Dish diameter
          <select className="field mt-1 !py-2 text-sm" value={d} onChange={(e) => setD(+e.target.value)}>
            {[0.3, 0.6, 1.2, 1.8].map((v) => (
              <option key={v} value={v}>
                {v} m
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-silver-400">
          Frequency
          <select className="field mt-1 !py-2 text-sm" value={f} onChange={(e) => setF(+e.target.value)}>
            {[7, 13, 15, 18, 23, 38].map((v) => (
              <option key={v} value={v}>
                {v} GHz
              </option>
            ))}
          </select>
        </label>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 font-mono">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-silver-500">Gain ≈</dt>
          <dd className="text-xl text-silver-50 tabular-nums">{gain.toFixed(1)} dBi</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-silver-500">HPBW ≈</dt>
          <dd className="text-xl text-silver-50 tabular-nums">{bw.toFixed(2)}°</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-snug text-silver-500">
        G = η(πD/λ)², η = 0.55 assumed; HPBW ≈ 70λ/D. Textbook approximation for a parabolic reflector — not a product specification.
      </p>
    </div>
  );
}

/* ---------------------------------------------- Alignment visual */
function AlignmentScope({ mode }: { mode: Mode }) {
  const off = mode === 'degrade';
  const rsl = rslFor[mode];
  const pct = Math.max(0, Math.min(1, (rsl + 90) / 60));
  return (
    <div className="rounded-xl border border-line bg-ink-950/50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-400">Antenna direction · RSL</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-warn">Illustrative</span>
      </div>
      <svg viewBox="0 0 300 120" className="mt-2 w-full" aria-hidden>
        <line x1="30" y1="60" x2="270" y2="60" stroke="rgba(148,178,214,.2)" strokeDasharray="3 5" />
        <motion.g animate={{ rotate: off ? -9 : 0 }} style={{ originX: '30px', originY: '60px' }} transition={{ duration: 1.2, ease: ease.precise }}>
          <path d="M30 60 L270 44 L270 76 Z" fill={off ? 'rgba(242,180,90,.12)' : 'rgba(79,216,235,.14)'} />
          <path d="M22 40 Q 40 60 22 80" fill="none" stroke="#dfe6ef" strokeWidth="3" />
        </motion.g>
        <path d="M278 40 Q 260 60 278 80" fill="none" stroke="#dfe6ef" strokeWidth="3" />
        <circle cx="270" cy="60" r="3" fill={off ? '#f2b45a' : '#4fd8eb'} />
      </svg>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${pct * 100}%`, backgroundColor: off ? '#f2b45a' : '#4fd8eb' }}
            transition={{ duration: 1, ease: ease.precise }}
          />
        </div>
        <span className={`font-mono text-sm tabular-nums ${off ? 'text-warn' : 'text-silver-50'}`}>{rsl} dBm</span>
      </div>
      <p className="mt-2 text-[11px] text-silver-500">
        {off
          ? 'Far-end antenna off the main lobe → received level falls below plan.'
          : mode === 'restore'
            ? 'Re-panned in azimuth / elevation → RSL back at the planned level.'
            : 'Antennas aligned on the main lobe; RSL at planned level.'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- Main */
export function Architecture() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>('transmit');
  const [selected, setSelected] = useState<string>('tx-odu');
  const node = chainNodes.find((n) => n.id === selected)!;
  const scrollTo = useScrollTo();
  const isAntenna = node.short === 'ANT';

  // Pulse position along the chain (0..chain length)
  const [pulse, setPulse] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: '100px 0px' });
  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setInterval(() => setPulse((p) => (p + 1) % (chainNodes.length + 2)), 420);
    return () => clearInterval(id);
  }, [reduced, inView]);

  const lit = (i: number) => {
    if (reduced) return true;
    const idx = mode === 'receive' ? chainNodes.length - 1 - i : i;
    return pulse >= idx;
  };
  const faultAt = (n: ChainNode) => mode === 'degrade' && (n.id === 'path' || n.id === 'rx-ant' || n.id === 'rx-odu');
  const restoredAt = (n: ChainNode) => mode === 'restore' && n.id === 'rx-ant';

  return (
    <section ref={sectionRef} data-live={inView ? 'true' : 'false'} id="architecture" aria-labelledby="arch-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="arch-title"
          index="03"
          eyebrow="Interactive Architecture"
          title="Huawei RTN Microwave Transmission Chain"
          lead="A split-mount point-to-point link, end to end. Select a component to inspect its role, key parameters, installation considerations and common fault points."
        />

        {/* Mode switch */}
        <Reveal className="mt-10">
          <div role="tablist" aria-label="Signal animation" className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-ink-900/70 p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  setPulse(0);
                }}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${mode === m.id ? 'text-ink-950' : 'text-silver-300 hover:text-silver-50'}`}
              >
                {mode === m.id && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-signal" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative flex items-center gap-1.5">
                  {m.id === 'degrade' && <TriangleAlert className="h-3.5 w-3.5" aria-hidden />}
                  {m.id === 'restore' && <RotateCcw className="h-3.5 w-3.5" aria-hidden />}
                  {m.id === 'transmit' && <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />}
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Chain */}
        <Reveal className="mt-8">
          <div className="panel p-4 sm:p-6">
            <div className="mb-4 hidden grid-cols-[4fr_1fr_4fr_1fr] gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-silver-500 lg:grid">
              <span>Site A · transmit</span>
              <span className="text-center">Path</span>
              <span className="text-right">Site B · receive</span>
              <span className="text-right">Network</span>
            </div>
            <ol className="relative grid grid-cols-1 gap-2 lg:grid-cols-10 lg:gap-2">
              {/* connector line (desktop horizontal / mobile vertical) */}
              <span aria-hidden className="absolute left-[27px] top-6 bottom-6 w-px bg-line-strong lg:left-6 lg:right-6 lg:top-[38px] lg:bottom-auto lg:h-px lg:w-auto" />
              {chainNodes.map((n, i) => {
                const Icon = iconFor(n);
                const on = lit(i);
                const fault = faultAt(n);
                const restored = restoredAt(n);
                const sel = selected === n.id;
                return (
                  <li key={n.id} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(n.id);
                        // On stacked layouts, bring the inspector into view.
                        if (window.matchMedia('(max-width: 1023px)').matches) scrollTo('#arch-inspector', { offset: -84, updateHash: false });
                      }}
                      aria-pressed={sel}
                      data-cursor="Inspect"
                      className={`group relative flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors lg:flex-col lg:gap-2 lg:p-3 lg:text-center ${
                        sel ? 'border-signal/60 bg-signal/[0.07]' : 'border-transparent hover:border-line-strong hover:bg-white/[0.02]'
                      }`}
                    >
                      <motion.span
                        className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
                        animate={{
                          borderColor: fault ? 'rgba(242,180,90,.8)' : on ? 'rgba(79,216,235,.7)' : 'rgba(148,178,214,.22)',
                          backgroundColor: fault ? 'rgba(242,180,90,.10)' : on ? 'rgba(79,216,235,.10)' : 'rgba(6,10,18,1)',
                          boxShadow: on && !fault ? '0 0 24px -6px rgba(79,216,235,.7)' : '0 0 0 0 rgba(0,0,0,0)',
                          rotate: fault && n.short === 'ANT' ? -12 : 0,
                        }}
                        transition={{ duration: 0.35 }}
                      >
                        <Icon className={`h-5 w-5 ${fault ? 'text-warn' : on ? 'text-signal-soft' : 'text-silver-400'}`} aria-hidden />
                        {restored && inView && (
                          <motion.span className="absolute inset-0 rounded-xl border border-teal" initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} />
                        )}
                      </motion.span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] tracking-[0.14em] text-silver-500">
                          {String(i + 1).padStart(2, '0')} · {n.short}
                        </span>
                        <span className={`block text-[13px] leading-tight ${sel ? 'text-silver-50' : 'text-silver-300'}`}>
                          <span className="lg:hidden">{n.name}</span>
                          <span className="hidden lg:inline">{n.label}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-silver-500" aria-live="polite">
              {mode === 'transmit' && 'Traffic enters the IDU, is modulated, carried over IF to the ODU and radiated by the antenna toward Site B.'}
              {mode === 'receive' && 'At Site B the antenna collects the beam, the ODU down-converts it and the IDU hands traffic to the transport network.'}
              {mode === 'degrade' && 'Illustrative fault: the far-end antenna has drifted off the main lobe, reducing the received signal level.'}
              {mode === 'restore' && 'After re-alignment and lock-down the received level returns to plan and the link is restored.'}
            </p>
          </div>
        </Reveal>

        {/* Inspector */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12 [&>*]:min-w-0">
          <div id="arch-inspector" className="panel p-6 sm:p-8 lg:col-span-7" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={node.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: ease.precise }}>
                <div className="eyebrow">Inspection panel</div>
                <h3 className="display mt-3 text-2xl font-semibold text-silver-50 sm:text-3xl">{node.name}</h3>
                <p className="mt-3 leading-relaxed text-silver-300">{node.role}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                  {(
                    [
                      ['Technical parameters', node.parameters],
                      ['Field installation', node.installation],
                      ['Troubleshooting points', node.troubleshooting],
                    ] as const
                  ).map(([title, items]) => (
                    <div key={title}>
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">{title}</h4>
                      <ul className="mt-2 space-y-1.5 text-sm text-silver-100">
                        {items.map((it) => (
                          <li key={it} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <AlignmentScope mode={mode} />
            <div className={`rounded-xl border p-4 transition-colors ${isAntenna ? 'border-signal/40 bg-signal/[0.04]' : 'border-line bg-ink-950/50'}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-400">Antenna reference specifications</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver-500">Supplied · reference</span>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ['Dish sizes', antennaReference.dishSizes.join(' · ')],
                  ['Gain', antennaReference.gain],
                  ['Front-to-back', antennaReference.frontToBack],
                  ['XPD', antennaReference.xpd],
                  ['Beamwidth', antennaReference.beamwidth],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                    <dt className="text-silver-500">{k}</dt>
                    <dd className="text-right text-silver-100">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] leading-snug text-silver-500">
                Reference values only. Actual figures depend on the specific antenna model, band and configuration.
              </p>
            </div>
            <ApertureCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
