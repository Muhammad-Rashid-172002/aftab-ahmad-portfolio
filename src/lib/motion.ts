import type { Transition, Variants } from 'motion/react';

/** Shared motion language — one curve family, three durations. */
export const ease = {
  precise: [0.22, 1, 0.36, 1] as const,
  signal: [0.65, 0, 0.35, 1] as const,
};

export const duration = { fast: 0.25, base: 0.6, slow: 1.1 };

export const spring: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.8 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.precise } },
};

export const stagger = (delay = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});
