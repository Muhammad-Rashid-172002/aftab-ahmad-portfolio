import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { ease } from '../../lib/motion';

/**
 * Decorative heads-up display. Every value here is SIMULATED for illustration —
 * it is not connected to any Huawei, Jazz or live network system.
 */
export function HeroHud() {
  const reduced = usePrefersReducedMotion();
  const [rsl, setRsl] = useState(-42.6);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setRsl(-42.6 + (Math.random() - 0.5) * 0.6), 1400);
    return () => clearInterval(id);
  }, [reduced]);

  const rows: [string, string][] = [
    ['Link', 'SITE A ⇄ SITE B'],
    ['Band', '15 GHz · illustrative'],
    ['Polarization', 'Vertical'],
    ['RSL', `${rsl.toFixed(1)} dBm`],
    ['Status', 'Aligned'],
  ];

  return (
    <motion.aside
      aria-label="Simulated link status display"
      className="pointer-events-none absolute bottom-10 right-6 hidden w-[250px] lg:block xl:right-10"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: ease.precise }}
    >
      <div className="tick-corners rounded-md bg-ink-900/55 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">MW Link · HUD</span>
          <span className="rounded-sm border border-warn/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-warn">
            Simulated
          </span>
        </div>
        <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-silver-500">{k}</dt>
              <dd className="tabular-nums text-silver-100">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex h-8 items-end gap-[3px]" aria-hidden>
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-full w-full origin-bottom rounded-[1px] bg-signal/60"
              initial={{ scaleY: 0.2 }}
              animate={reduced ? { scaleY: 0.35 + ((i * 7) % 18) / 30 } : { scaleY: [0.2, 0.35 + ((i * 7) % 20) / 30, 0.2] }}
              transition={{ duration: 1.6 + (i % 5) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
            />
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-snug text-silver-500">
          Visual illustration only. Not live network telemetry.
        </p>
      </div>
    </motion.aside>
  );
}
