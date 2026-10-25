import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { expertise } from '../../data/profile';
import type { ExpertiseCategory } from '../../types/portfolio';
import { ease } from '../../lib/motion';
import { Reveal, SectionHeading } from '../ui/primitives';
import { Live, useLive } from '../ui/Live';

const stroke = { fill: 'none', stroke: '#4fd8eb', strokeWidth: 1.4 } as const;
const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.2, delay, ease: ease.signal },
});

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay },
});

function Illustration({ id }: { id: ExpertiseCategory['id'] }) {
  const live = useLive();
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      {id === 'microwave' && (
        <>
          <motion.path d="M40 180 L60 60 L80 180 M50 120 H70" {...stroke} {...draw()} stroke="#aab7c8" />
          <motion.path d="M240 180 L260 70 L280 180 M250 125 H270" {...stroke} {...draw(0.1)} stroke="#aab7c8" />
          <motion.path d="M70 74 Q 82 86 70 98" {...stroke} strokeWidth={3} stroke="#dfe6ef" {...draw(0.3)} />
          <motion.path d="M250 84 Q 238 96 250 108" {...stroke} strokeWidth={3} stroke="#dfe6ef" {...draw(0.35)} />
          <motion.path d="M78 86 Q 160 40 242 96" {...stroke} strokeDasharray="4 6" className="animate-dash" {...fade(0.5)} />
          <motion.ellipse cx="160" cy="91" rx="84" ry="26" {...stroke} strokeOpacity={0.3} strokeDasharray="3 5" {...fade(0.7)} />
        </>
      )}
      {id === 'operations' && (
        <>
          {[60, 160, 260].map((x, i) => (
            <motion.rect key={x} x={x - 26} y={40} width={52} height={36} rx={6} {...stroke} stroke="#aab7c8" {...draw(i * 0.1)} />
          ))}
          <motion.rect x={110} y={140} width={100} height={46} rx={8} {...stroke} {...draw(0.3)} />
          <text x="160" y="168" textAnchor="middle" fontSize="11" className="font-mono" fill="#9be8f3">NOC</text>
          {[60, 160, 260].map((x, i) => (
            <motion.path key={x} d={`M${x} 76 C ${x} 110, 160 110, 160 140`} {...stroke} strokeDasharray="4 6" className="animate-dash" {...fade(0.5 + i * 0.1)} />
          ))}
          <motion.circle cx="260" cy="58" r="5" fill="#f2b45a" initial={{ opacity: 0 }} animate={{ opacity: live ? [0, 1, 0.3, 1] : 1 }} transition={live ? { duration: 2, repeat: Infinity } : undefined} />
        </>
      )}
      {id === 'infrastructure' && (
        <>
          <motion.path d="M150 200 L160 30 L170 200" {...stroke} stroke="#aab7c8" {...draw()} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <motion.path key={k} d={`M${151 + k * 0.6} ${200 - k * 28} L${169 - k * 0.6} ${172 - k * 28}`} {...stroke} stroke="#aab7c8" strokeOpacity={0.5} {...draw(0.1 + k * 0.05)} />
          ))}
          {[-1, 0, 1].map((d) => (
            <motion.rect key={d} x={160 + d * 40 - 6} y={40} width={12} height={40} rx={2} {...stroke} stroke="#dfe6ef" {...draw(0.5)} />
          ))}
          <motion.path d="M120 90 V 150 H 230 V 180" {...stroke} stroke="#d9a35b" {...draw(0.8)} />
          <motion.rect x={210} y={170} width={50} height={36} rx={4} {...stroke} {...draw(0.9)} />
          <motion.path d="M70 200 H 140 M80 200 V 210 M74 210 H86" {...stroke} stroke="#2bb8a6" {...draw(1)} />
        </>
      )}
      {id === 'research' && (
        <>
          {[50, 38, 26, 14].map((r, i) => (
            <motion.ellipse key={r} cx="160" cy="70" rx={r * 2} ry={r * 0.5} {...stroke} stroke="#d9a35b" {...draw(i * 0.08)} />
          ))}
          {[30, 20, 10].map((r, i) => (
            <motion.ellipse key={r} cx="160" cy="160" rx={r * 2} ry={r * 0.5} {...stroke} stroke="#d9a35b" {...draw(0.4 + i * 0.08)} />
          ))}
          {[40, 70, 100].map((w, i) => (
            <motion.path key={w} d={`M${160 - w} 70 C ${160 - w - 20} 130, ${160 - w / 3} 175, 160 175 S ${160 + w + 20} 130, ${160 + w} 70`} {...stroke} strokeOpacity={0.5 - i * 0.1} strokeDasharray="4 6" className="animate-dash" {...fade(0.6 + i * 0.1)} />
          ))}
        </>
      )}
    </svg>
  );
}

function Item({ name, note }: { name: string; note: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="border-b border-line last:border-0">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
        <span className="text-[15px] text-silver-100">{name}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-4 w-4 text-silver-500" aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: ease.precise }} className="overflow-hidden">
            <p className="pb-4 text-sm leading-relaxed text-silver-400">{note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Expertise() {
  const [active, setActive] = useState<ExpertiseCategory['id']>('microwave');
  const cat = expertise.find((e) => e.id === active)!;
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="expertise-title" index="04" eyebrow="Engineering Expertise" title="Where theory meets the tower." lead="Four areas of practice, from radio link commissioning to electromagnetic research." />

        <Reveal className="mt-12">
          <div role="tablist" aria-label="Expertise categories" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {expertise.map((e) => (
              <button
                key={e.id}
                role="tab"
                id={`tab-${e.id}`}
                aria-selected={active === e.id}
                aria-controls="expertise-panel"
                onClick={() => setActive(e.id)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-colors ${active === e.id ? 'border-signal/50 bg-signal/[0.06]' : 'border-line bg-ink-900/50 hover:border-line-strong'}`}
              >
                <span className="font-mono text-[11px] text-silver-500">{e.code}.</span>
                <span className={`mt-1 block text-sm font-semibold sm:text-base ${active === e.id ? 'text-silver-50' : 'text-silver-300'}`}>{e.title}</span>
                {active === e.id && <motion.span layoutId="exp-bar" className="absolute inset-x-0 bottom-0 h-[2px] bg-signal" />}
              </button>
            ))}
          </div>
        </Reveal>

        <div id="expertise-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-6 grid gap-6 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="panel relative overflow-hidden lg:col-span-5">
            <Live className="hairline-grid aspect-[16/11] w-full p-4">
              <AnimatePresence mode="wait">
                <motion.div key={active} className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Illustration id={active} />
                </motion.div>
              </AnimatePresence>
            </Live>
            <div className="border-t border-line p-6">
              <div className="eyebrow">{cat.code} · {cat.title}</div>
              <p className="mt-2 leading-relaxed text-silver-300">{cat.summary}</p>
            </div>
          </div>
          <div className="panel p-2 sm:p-6 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.ul key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: ease.precise }} className="px-4 sm:px-0">
                {cat.items.map((it) => (
                  <Item key={it.name} {...it} />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
