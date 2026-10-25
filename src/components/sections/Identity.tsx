import { motion, useScroll, useTransform } from 'motion/react';
import { Building2, Cpu, GraduationCap, Mail, Radio, Waves, Wrench } from 'lucide-react';
import { useRef } from 'react';
import { profile } from '../../data/profile';
import { Reveal, SectionHeading, SpecRow, Stagger, StaggerItem } from '../ui/primitives';
import { usePrefersReducedMotion } from '../../lib/hooks';

const panels = [
  { icon: Building2, label: 'Current affiliation', value: profile.affiliation, sub: profile.projectAssociation },
  { icon: Radio, label: 'Primary technical domain', value: profile.primaryDomain, sub: 'Point-to-point radio links' },
  { icon: Cpu, label: 'Main hardware platform', value: 'Huawei RTN', sub: '905 / 950 / 980' },
  { icon: GraduationCap, label: 'Academic institution', value: profile.institutionShort, sub: profile.degree },
  { icon: Waves, label: 'Research domain', value: 'Wireless Power Transfer', sub: 'Implantable neurostimulators' },
  { icon: Wrench, label: 'Field operations', value: 'Deployment & acceptance', sub: 'Surveys · alignment · ISDP' },
];

export function Identity() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

  return (
    <section id="identity" aria-labelledby="identity-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="identity-title"
          index="01"
          eyebrow="Professional Identity"
          title={<>Field engineer. Systems thinker.</>}
          lead="Working on microwave transmission and site delivery for mobile network infrastructure, with an academic grounding in electromagnetic research."
        />

        <div ref={ref} className="mt-14 grid gap-6 lg:grid-cols-12 [&>*]:min-w-0 lg:gap-8">
          {/* Portrait */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <figure className="panel group relative overflow-hidden p-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)]">
                <motion.picture style={{ y }} className="absolute inset-[-6%_0]">
                  <source srcSet={`${profile.portrait.srcSmall} 413w, ${profile.portrait.src} 826w`} sizes="(min-width:1024px) 480px, 100vw" type="image/webp" />
                  <img
                    src={profile.portrait.fallback}
                    alt={profile.portrait.alt}
                    width={profile.portrait.width}
                    height={profile.portrait.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-[50%_18%] saturate-[.55] contrast-[1.05] transition duration-700 group-hover:saturate-90"
                  />
                </motion.picture>
                {/* Duotone grading to sit in the palette */}
                <div className="pointer-events-none absolute inset-0 bg-[#0a2540] opacity-70 mix-blend-color transition-opacity duration-700 group-hover:opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06121f]/50 via-transparent to-transparent mix-blend-multiply" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgb(3_5_10/.6))]" />
                <div className="tick-corners pointer-events-none absolute inset-4" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Portfolio identity panel</div>
                  <div className="display mt-2 text-3xl font-semibold text-silver-50">{profile.name}</div>
                  <div className="mt-1 text-sm text-silver-300">{profile.role}</div>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          {/* Identity card */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal delay={0.05} className="panel p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver-400">Engineer profile</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">Self-reported portfolio information</span>
              </div>
              <dl className="mt-5">
                <SpecRow label="Name" value={profile.name} />
                <SpecRow label="Title" value={profile.role} />
                <SpecRow label="Affiliation" value={profile.affiliation} />
                <SpecRow label="Project" value={profile.projectAssociation} />
                <SpecRow label="Alma mater" value={profile.institution} />
                <SpecRow label="Degree" value={profile.degree} />
                <SpecRow label="Domain" value={profile.primaryDomain} />
                <SpecRow label="Platforms" value={profile.platforms} />
                <SpecRow label="Research" value={profile.research} />
                <SpecRow
                  label="Email"
                  value={
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 text-signal-soft hover:text-signal">
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                      <span className="break-all">{profile.email}</span>
                    </a>
                  }
                />
              </dl>
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {panels.map((p) => (
                <StaggerItem key={p.label}>
                  <div className="group h-full rounded-2xl border border-line bg-ink-900/60 p-4 transition-colors hover:border-signal/30">
                    <div className="flex items-center justify-between">
                      <p.icon className="h-4 w-4 text-signal" aria-hidden />
                      <span className="h-1.5 w-1.5 rounded-full bg-teal/70 transition group-hover:bg-signal" aria-hidden />
                    </div>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-silver-500">{p.label}</div>
                    <div className="mt-1 font-semibold text-silver-50">{p.value}</div>
                    <div className="text-sm text-silver-400">{p.sub}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
