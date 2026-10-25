import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from './hooks';

type ScrollTo = (target: string | number, opts?: { offset?: number; immediate?: boolean; updateHash?: boolean }) => void;

const ScrollCtx = createContext<ScrollTo>(() => {});

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback<ScrollTo>((target, opts) => {
    const offset = opts?.offset ?? -72;
    let el: HTMLElement | null = null;
    if (typeof target === 'string') {
      el = document.querySelector(target.startsWith('#') ? target : `#${target}`);
      if (!el) return;
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el ?? (target as number), { offset, immediate: opts?.immediate });
    } else {
      const y = el ? el.getBoundingClientRect().top + window.scrollY + offset : (target as number);
      window.scrollTo({ top: y, behavior: 'auto' });
    }
    if (el) {
      // Move focus for keyboard / screen-reader users without a second scroll.
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      if (opts?.updateHash !== false && el.id) history.replaceState(null, '', `#${el.id}`);
    }
  }, []);

  return <ScrollCtx.Provider value={scrollTo}>{children}</ScrollCtx.Provider>;
}

export const useScrollTo = () => useContext(ScrollCtx);

/** onClick handler for in-page anchor links that keeps native href for no-JS / new tab. */
export function useAnchorClick() {
  const scrollTo = useScrollTo();
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    scrollTo(href);
  };
}
