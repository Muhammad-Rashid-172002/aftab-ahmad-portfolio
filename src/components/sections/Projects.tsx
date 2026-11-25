import { AnimatePresence, motion } from 'motion/react';
import { Crosshair, Info, ScanSearch } from 'lucide-react';
import { useState } from 'react';
import { projects } from '../../data/profile';
import type { Project } from '../../types/portfolio';
import { ease } from '../../lib/motion';
import { Reveal, SectionHeading } from '../ui/primitives';
import { CoilViz, LinkViz, SiteViz } from '../viz/ProjectViz';
import { Live } from '../ui/Live';
import { Tilt } from '../ui/Tilt';

const vizMap = { coil: CoilViz, link: LinkViz, site: SiteViz };

function DetailsCard({ label, detail, id }: { label: string; detail: string; id: string }) {
  return (
    <div className="rounded-2xl border border-signal/25 bg-signal/[0.04] p-5" aria-live="polite">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Details · {label}</div>
      <AnimatePresence mode="wait">
        <motion.p
          key={id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: ease.precise }}
          className="mt-2 text-sm leading-relaxed text-silver-100"
        >
          {detail}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function ProjectChapter({ project, flip }: { project: Project; flip: boolean }) {
  const [active, setActive] = useState(project.hotspots[0].id);
  const Viz = vizMap[project.viz];
  const labels = Object.fromEntries(project.hotspots.map((h) => [h.id, h.label]));
  const current = project.hotspots.find((h) => h.id === active)!;

  return (
    <article aria-labelledby={`p-${project.id}`} className="grid items-start gap-6 lg:grid-cols-12 [&>*]:min-w-0 lg:gap-10">
      {/* Stage */}
      <Reveal className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        <Tilt className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver-400">
              <ScanSearch className="h-3.5 w-3.5 text-signal" aria-hidden /> Inspection view · {project.number}
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500 sm:inline">Schematic · not to scale</span>
          </div>
          <Live className="hairline-grid relative aspect-[16/11] w-full">
            <Viz active={active} onSelect={setActive} labels={labels} />
          </Live>
          {/* Hotspot selector — also the touch-friendly control on small screens */}
          <div role="toolbar" aria-label={`${project.title} components`} className="flex gap-2 overflow-x-auto border-t border-line px-4 py-3 [scrollbar-width:none]">
            {project.hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActive(h.id)}
                aria-pressed={active === h.id}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  active === h.id ? 'border-signal/60 bg-signal/10 text-silver-50' : 'border-line text-silver-400 hover:text-silver-100'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </Tilt>
        {/* On small screens the details sit directly under the diagram */}
        <div className="mt-4 lg:hidden">
          <DetailsCard label={current.label} detail={current.detail} id={current.id} />
        </div>
      </Reveal>

      {/* Narrative */}
      <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="display text-6xl font-semibold text-transparent [-webkit-text-stroke:1px_rgb(79_216_235/.55)]">{project.number}</span>
            <span className="eyebrow">{project.kind}</span>
          </div>
          <h3 id={`p-${project.id}`} className="display mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold text-silver-50 [text-wrap:balance]">
            {project.title}
          </h3>
          <p className="mt-4 leading-relaxed text-silver-300">{project.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-silver-400">{project.context}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-silver-500">Competencies</h4>
          <ul className="mt-3 grid gap-2">
            {project.competencies.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-silver-100">
                <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden /> {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-7 hidden lg:block">
            <DetailsCard label={current.label} detail={current.detail} id={current.id} />
          </div>
          {project.integrityNote && (
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-silver-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {project.integrityNote}
            </p>
          )}
        </Reveal>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="work-title"
          index="02"
          eyebrow="Selected Engineering Projects"
          title="Three disciplines. One signal chain."
          lead="From an academic wireless power link to commercial microwave backhaul and the physical site that hosts it. Select any marker to inspect a component."
        />
        <div className="mt-16 flex flex-col gap-24 sm:gap-32">
          {projects.map((p, i) => (
            <ProjectChapter key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
