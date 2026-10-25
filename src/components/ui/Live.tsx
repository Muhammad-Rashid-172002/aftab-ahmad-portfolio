import { useInView } from 'motion/react';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../lib/hooks';

/**
 * Gates looping animations: children only animate while the region is near the
 * viewport (and never under reduced motion). CSS loops are paused via data-live.
 */
const LiveCtx = createContext(true);
export const useLive = () => useContext(LiveCtx);

export function Live({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '120px 0px 120px 0px' });
  const reduced = usePrefersReducedMotion();
  const live = inView && !reduced;
  return (
    <div ref={ref} className={className} data-live={live ? 'true' : 'false'}>
      <LiveCtx.Provider value={live}>{children}</LiveCtx.Provider>
    </div>
  );
}
