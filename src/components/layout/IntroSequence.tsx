import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { ease } from '../../lib/motion';
import { profile } from '../../data/profile';

const KEY = 'aa-intro-seen';
const TOTAL_MS = 2900;

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** Short, skippable cinematic intro. Shown once per browser session. */
export function IntroSequence() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(() => typeof window !== 'undefined' && !alreadySeen());

  useEffect(() => {
    if (!show) return;
    if (reduced) {
      setShow(false);
      return;
    }
    const done = () => setShow(false);
    const t = window.setTimeout(done, TOTAL_MS);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && done();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [show, reduced]);

  useEffect(() => {
    if (!show) {
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* storage unavailable */
      }
    }
  }, [show]);

  const traces = [
    'M0 180 H260 L300 220 H620',
    'M1200 120 H900 L860 160 H600',
    'M0 520 H180 L220 480 H560',
    'M1200 600 H980 L940 560 H640',
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: ease.precise } }}
          aria-label="Introduction"
          role="presentation"
        >
          <motion.div
            className="hairline-grid absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[120px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: ease.precise }}
          />

          <svg viewBox="0 0 1200 700" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {traces.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="rgb(79 216 235 / 0.5)"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0.35] }}
                transition={{ duration: 1.2, delay: 0.15 + i * 0.08, ease: ease.signal }}
              />
            ))}
            {/* Two towers */}
            {[
              { x: 230, h: 360 },
              { x: 970, h: 320 },
            ].map((t, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: ease.precise }}
                stroke="rgb(170 183 200 / 0.7)"
                strokeWidth={1.2}
                fill="none"
              >
                <path d={`M${t.x - 26} 560 L${t.x} ${560 - t.h} L${t.x + 26} 560`} />
                {Array.from({ length: 6 }).map((_, k) => {
                  const y1 = 560 - (t.h / 6) * k;
                  const y2 = 560 - (t.h / 6) * (k + 1);
                  const w1 = 26 * (1 - k / 6);
                  const w2 = 26 * (1 - (k + 1) / 6);
                  return <path key={k} d={`M${t.x - w1} ${y1} L${t.x + w2} ${y2} M${t.x + w1} ${y1} L${t.x - w2} ${y2}`} strokeOpacity={0.45} />;
                })}
                <ellipse cx={i === 0 ? t.x + 14 : t.x - 14} cy={560 - t.h + 40} rx={6} ry={16} stroke="rgb(223 230 239)" />
              </motion.g>
            ))}
            {/* Beam */}
            <motion.line
              x1={244}
              y1={240}
              x2={956}
              y2={280}
              stroke="url(#introBeam)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8, ease: ease.signal }}
            />
            <motion.circle
              r={4}
              fill="#9be8f3"
              initial={{ cx: 244, cy: 240, opacity: 0 }}
              animate={{ cx: [244, 956], cy: [240, 280], opacity: [0, 1, 1, 0] }}
              transition={{ delay: 1.3, duration: 1.1, ease: 'linear' }}
            />
            <defs>
              <linearGradient id="introBeam" x1="0" x2="1">
                <stop offset="0" stopColor="#4fd8eb" stopOpacity="0.1" />
                <stop offset="0.5" stopColor="#4fd8eb" />
                <stop offset="1" stopColor="#4fd8eb" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 text-center">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.24em' }}
              transition={{ delay: 1.2, duration: 0.9, ease: ease.precise }}
            >
              {profile.title}
            </motion.div>
            <h1 className="display mt-4 overflow-hidden text-[clamp(2.4rem,9vw,6rem)] font-semibold text-silver-50">
              {profile.name.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 1.35 + i * 0.035, duration: 0.7, ease: ease.precise }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute bottom-6 right-6 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-silver-300 hover:text-silver-50"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
