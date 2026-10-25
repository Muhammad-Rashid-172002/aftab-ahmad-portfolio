import { AnimatePresence, motion } from 'motion/react';
import { Briefcase, ChevronDown, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { experience } from '../../data/profile';
import { ease } from '../../lib/motion';
import { Reveal, SectionHeading } from '../ui/primitives';

export function Experience() {
  const [open, setOpen] = useState<string>(experience[0].id);
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading id="exp-title" index="06" eyebrow="Professional Experience" title="Career sequence." lead="Most recent first. Dates are omitted where they were not supplied." />
            </div>
          </div>

          <ol className="relative lg:col-span-8">
            <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-signal/70 via-line-strong to-transparent" />
            {experience.map((e, i) => {
              const isOpen = open === e.id;
              const Icon = e.type === 'Internship' ? GraduationCap : Briefcase;
              return (
                <Reveal as="li" key={e.id} delay={i * 0.05} className="relative pb-6 pl-14 last:pb-0">
                  <span
                    className={`absolute left-0 top-3 grid h-10 w-10 place-items-center rounded-full border ${e.type === 'Current' ? 'border-signal/70 bg-signal/10' : 'border-line-strong bg-ink-900'}`}
                    aria-hidden
                  >
                    <Icon className={`h-4 w-4 ${e.type === 'Current' ? 'text-signal' : 'text-silver-400'}`} />
                    {e.type === 'Current' && <span className="absolute inset-0 animate-ping rounded-full border border-signal/40" />}
                  </span>
                  <div className={`panel transition-colors ${isOpen ? '!border-signal/30' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? '' : e.id)}
                      aria-expanded={isOpen}
                      aria-controls={`exp-${e.id}`}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${e.type === 'Current' ? 'text-signal' : 'text-silver-500'}`}>{e.type === 'Current' ? 'Current experience' : e.type === 'Previous' ? 'Previous experience' : 'Internship'}</span>
                        <span className="display mt-2 block text-xl font-semibold text-silver-50 [overflow-wrap:anywhere] sm:text-2xl [font-stretch:105%]">{e.organization}</span>
                        <span className="mt-1 block text-sm text-silver-300">
                          {e.role}
                          {e.context && <span className="text-silver-500"> · {e.context}</span>}
                        </span>
                      </span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="mt-1 shrink-0">
                        <ChevronDown className="h-5 w-5 text-silver-500" aria-hidden />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`exp-${e.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: ease.precise }} className="overflow-hidden">
                          <div className="border-t border-line px-5 pb-6 pt-4 sm:px-6">
                            <ul className="grid gap-2 sm:grid-cols-2">
                              {e.points.map((p) => (
                                <li key={p} className="flex gap-2.5 text-sm text-silver-100">
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
                                  {p}
                                </li>
                              ))}
                            </ul>
                            {e.systems && (
                              <div className="mt-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">Relevant systems</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {e.systems.map((s) => (
                                    <span key={s} className="chip">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
