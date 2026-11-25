import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '../../lib/hooks';

/**
 * Subtle perspective tilt that follows the pointer, with a soft specular glare.
 * Fine pointers only; disabled under reduced motion. Max ±max degrees.
 */
export function Tilt({ children, className, max = 4 }: { children: ReactNode; className?: string; max?: number }) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useTransform([gx, gy] as never, ([x, y]: string[]) => `radial-gradient(600px circle at ${x} ${y}, rgba(79,216,235,.10), transparent 45%)`);

  if (!enabled) return <div className={className}>{children}</div>;
  return (
    <div className="[perspective:1400px]">
      <motion.div
        ref={ref}
        className={`relative ${className ?? ''}`}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[var(--radius-panel)]" style={{ background: glare }} />
      </motion.div>
    </div>
  );
}
