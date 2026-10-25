import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navItems, profile } from '../../data/profile';
import { useActiveSection } from '../../lib/hooks';
import { useAnchorClick } from '../../lib/smoothScroll';
import { Magnetic } from '../ui/primitives';
import { ease } from '../../lib/motion';

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const onAnchor = useAnchorClick();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    onAnchor(e);
  };

  return (
    <header className="no-print fixed inset-x-0 top-0 z-[60]">
      <div
        className={`mx-auto mt-3 flex max-w-[1240px] items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled ? 'mx-3 border border-line bg-ink-900/75 shadow-[0_20px_50px_-25px_rgba(0,0,0,.9)] backdrop-blur-xl sm:mx-6 xl:mx-auto' : 'mx-3 border border-transparent sm:mx-6 xl:mx-auto'
        }`}
      >
        <a href="#top" onClick={go} className="group flex items-center gap-3 rounded-full pr-2" aria-label={`${profile.name} — back to top`}>
          <span className="relative grid h-9 w-9 place-items-center rounded-full border border-signal/40 bg-ink-800 font-mono text-[12px] font-semibold tracking-wider text-signal-soft">
            {profile.monogram}
            <span className="absolute inset-0 rounded-full border border-signal/0 transition group-hover:scale-125 group-hover:border-signal/30" />
          </span>
          <span className="hidden flex-col leading-tight lg:flex">
            <span className="text-sm font-semibold text-silver-50">{profile.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">Telecom Engineer</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${
                    active === item.id ? 'text-silver-50' : 'text-silver-400 hover:text-silver-100'
                  }`}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 -z-0 rounded-full border border-signal/30 bg-signal/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:inline-flex">
            <a href="#contact" onClick={go} className="btn btn-primary !min-h-[40px] !px-4 text-[13px]" data-cursor="Connect">
              Let's Connect <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </Magnetic>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-silver-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-3 top-[72px] rounded-3xl border border-line bg-ink-900/95 p-3 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: ease.precise }}
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <motion.li key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <a
                      href={`#${item.id}`}
                      onClick={go}
                      className={`flex items-center justify-between rounded-2xl px-4 py-4 text-lg ${
                        active === item.id ? 'bg-signal/10 text-silver-50' : 'text-silver-300'
                      }`}
                    >
                      {item.label}
                      <span className="font-mono text-[11px] text-silver-500">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a href="#contact" onClick={go} className="btn btn-primary mt-2 w-full">
                Let's Connect <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
