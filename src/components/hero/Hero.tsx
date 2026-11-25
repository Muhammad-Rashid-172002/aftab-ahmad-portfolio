import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, FileText, MapPin } from 'lucide-react';
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { hero, profile } from '../../data/profile';
import { detectWebGL, isLowPowerDevice, useMediaQuery, usePrefersReducedMotion } from '../../lib/hooks';
import { ease } from '../../lib/motion';
import { useAnchorClick } from '../../lib/smoothScroll';
import { Magnetic } from '../ui/primitives';
import { HeroFallback } from './HeroFallback';
import { HeroHud } from './HeroHud';

const HeroScene = lazy(() => import('./HeroScene'));

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[hero] 3D scene disabled:', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery('(max-width: 767px)');
  const onAnchor = useAnchorClick();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [lowPower, setLowPower] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // `?no3d` forces the lightweight SVG scene (useful for debugging / screenshots).
    const forceFallback = new URLSearchParams(window.location.search).has('no3d');
    // Respect Data Saver: skip the ~250 kB 3D chunk and keep the SVG scene.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    setWebgl(!forceFallback && !saveData && detectWebGL());
    setLowPower(isLowPowerDevice());
  }, []);

  const fallback = <HeroFallback animate={!reduced} />;
  const lineDelay = 0.15;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Scene */}
      <div className="absolute inset-0 -z-10">
        {fallback}
        {webgl && (
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1.2 }}>
                <HeroScene reduced={reduced} lowPower={lowPower} mobile={mobile} onReady={() => setReady(true)} />
              </motion.div>
            </Suspense>
          </SceneBoundary>
        )}
        {/* Scrims for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/55 to-transparent max-md:bg-gradient-to-t max-md:from-ink-950 max-md:from-45% max-md:via-ink-950/70 max-md:via-60% max-md:to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/80 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-end px-4 pb-12 pt-[44svh] sm:px-6 md:justify-center md:pb-24 md:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.precise, delay: 0.05 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="chip">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
              </span>
              {profile.affiliation} · Jazz Network Rollout
            </span>
            <span className="chip">
              <MapPin className="h-3 w-3" aria-hidden /> {profile.location}
            </span>
          </motion.div>

          <motion.p
            className="mt-7 font-mono text-[12px] uppercase tracking-[0.22em] text-silver-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            <span className="text-silver-50">{profile.name}</span> — {profile.title}
            <span className="mt-1 block text-silver-500">{profile.role}</span>
          </motion.p>

          <h1 id="hero-title" className="display mt-5 text-[clamp(2.5rem,6.4vw,4.9rem)] font-semibold text-silver-50">
            {hero.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? 'bg-gradient-to-r from-signal-soft via-signal to-teal bg-clip-text text-transparent' : ''}`}
                  initial={{ y: reduced ? 0 : '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: ease.precise, delay: lineDelay + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-silver-300 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.precise, delay: 0.45 }}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.precise, delay: 0.6 }}
          >
            <Magnetic>
              <a href="#work" onClick={onAnchor} className="btn btn-primary" data-cursor="Explore">
                Explore My Work <ArrowDown className="h-4 w-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={onAnchor} className="btn btn-ghost" data-cursor="Connect">
                Let's Connect <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </Magnetic>
            <a href="#resume" onClick={onAnchor} className="btn !px-3 text-silver-300 hover:text-silver-50">
              <FileText className="h-4 w-4" aria-hidden /> View Resume
            </a>
          </motion.div>
        </div>
      </div>

      <HeroHud />

      <motion.a
        href="#identity"
        onClick={onAnchor}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-silver-500 hover:text-silver-200 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Scroll to profile"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line-strong">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-signal"
            animate={reduced ? undefined : { y: [-12, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}
