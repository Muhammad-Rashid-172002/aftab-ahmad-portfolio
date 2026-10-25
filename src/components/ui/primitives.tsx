import { motion, useMotionValue, useSpring, useScroll } from 'motion/react';
import { useRef, type ReactNode, type ElementType } from 'react';
import { fadeUp, stagger, ease } from '../../lib/motion';
import { useFinePointer, usePrefersReducedMotion } from '../../lib/hooks';

/* ---------------------------------------------------------------- Reveal */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'p' | 'span';
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{
        hidden: fadeUp.hidden,
        show: { ...(fadeUp.show as object), transition: { duration: 0.7, ease: ease.precise, delay } },
      }}
    >
      {children}
    </Comp>
  );
}

export function Stagger({ children, className, gap = 0.07 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={stagger(gap)}
    >
      {children}
    </motion.div>
  );
}
export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} variants={fadeUp}>
    {children}
  </motion.div>
);

/* -------------------------------------------------------- Section header */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  id,
  align = 'left',
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
}) {
  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <Reveal>
        <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="font-mono text-[11px] text-silver-500">{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-signal/70 to-transparent" aria-hidden />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="display mt-5 text-[clamp(2rem,5.2vw,3.75rem)] font-semibold text-silver-50 [text-wrap:balance]">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-silver-300 sm:text-lg">{lead}</p>
        </Reveal>
      )}
    </header>
  );
}

/* ------------------------------------------------------- Magnetic wrapper */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const enabled = fine && !reduced;

  return (
    <motion.span
      ref={ref}
      className={className ?? 'inline-flex'}
      style={enabled ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------ Scroll progress */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-teal via-signal to-signal-soft"
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------- Spec row */
export function SpecRow({ label, value, as: As = 'div' }: { label: string; value: ReactNode; as?: ElementType }) {
  return (
    <As className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver-500">{label}</dt>
      <dd className="text-right text-sm text-silver-50">{value}</dd>
    </As>
  );
}
