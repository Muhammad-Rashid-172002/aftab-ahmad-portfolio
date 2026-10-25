import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { philosophy, profile } from '../../data/profile';
import { ease } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { Reveal, SectionHeading } from '../ui/primitives';

const chain = ['Radio propagation theory', 'Field execution', 'Equipment configuration', 'Network availability', 'Disciplined site acceptance'];

function PathProfile() {
  // Terrain profile between two sites with line of sight and first Fresnel zone.
  const terrain = 'M0 170 C 40 160, 70 150, 110 156 S 170 130, 210 138 S 270 150, 300 128 S 360 140, 400 150 L400 220 L0 220 Z';
  return (
    <svg viewBox="0 0 400 220" className="w-full" role="img" aria-label="Path profile sketch showing terrain, line of sight and Fresnel zone clearance">
      <defs>
        <linearGradient id="terr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2a41" />
          <stop offset="1" stopColor="#06090f" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(148,178,214,.07)" />
      ))}
      <path d={terrain} fill="url(#terr)" stroke="rgba(148,178,214,.35)" />
      <path d="M12 166 L22 60 L32 166 M15 130 H29 M18 95 H26 M15 130 L26 95 M29 130 L18 95" fill="none" stroke="#aab7c8" strokeWidth="1.2" />
      <path d="M368 152 L378 54 L388 152 M371 118 H385 M374 85 H382 M371 118 L382 85 M385 118 L374 85" fill="none" stroke="#aab7c8" strokeWidth="1.2" />
      <rect x="24" y="54" width="5" height="12" rx="1" fill="#dfe6ef" />
      <rect x="371" y="48" width="5" height="12" rx="1" fill="#dfe6ef" />
      <motion.path
        d="M24 60 Q 200 118 376 54"
        fill="rgba(79,216,235,.06)"
        stroke="#4fd8eb"
        strokeOpacity=".4"
        strokeDasharray="3 5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
      />
      <motion.path
        d="M24 60 Q 200 -4 376 54"
        fill="none"
        stroke="#4fd8eb"
        strokeOpacity=".4"
        strokeDasharray="3 5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
      />
      <motion.line
        x1="24"
        y1="60"
        x2="376"
        y2="54"
        stroke="#9be8f3"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: ease.signal }}
      />
      <text x="200" y="24" textAnchor="middle" fontSize="10" className="font-mono" fill="#8494aa">
        LOS · F1 CLEARANCE CHECK
      </text>
      <text x="300" y="120" textAnchor="middle" fontSize="9" className="font-mono" fill="#2bb8a6">
        CLEAR
      </text>
    </svg>
  );
}

export function About() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const h = useTransform(scrollYProgress, [0, 1], reduced ? ['100%', '100%'] : ['0%', '100%']);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="about-title" index="05" eyebrow="About · Engineering Philosophy" title="Engineering meets execution." />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-snug text-silver-50 [font-stretch:100%]">
                Telecommunications engineering is where radio propagation theory meets physical field delivery — and where success is measured in clean signal margins, network availability and work that passes acceptance.
              </p>
            </Reveal>
            <div className="mt-8 space-y-5 leading-relaxed text-silver-300">
              <Reveal>
                <p>
                  As a {profile.title.toLowerCase()} with {profile.affiliation}, my work centres on deploying, aligning and troubleshooting microwave transmission links for the Jazz mobile network — from Fresnel-zone checks on the path profile and panning dishes onto the main lobe, to configuring Huawei RTN equipment through WebLCT and coordinating with the NOC.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  Before Huawei, I built practical foundations at Turnotech and through internships at NTC and PTCL, gaining exposure to optical fiber networks, NOC workflows and switching backbones.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  At {profile.institutionShort}, my final-year research examined low-frequency wireless power transfer for implantable neurostimulators — how inductive coupling can deliver energy across tissue without through-skin wiring. That analytical habit carries into the field: model the problem, then verify it.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-10">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver-500">Guiding principles</h3>
              <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {philosophy.map((p, i) => (
                  <div key={p.title} className={`bg-ink-900 p-5 ${i === philosophy.length - 1 ? 'sm:col-span-2' : ''}`}>
                    <dt className="flex items-center gap-2 font-semibold text-silver-50">
                      <span className="font-mono text-[11px] text-signal">0{i + 1}</span> {p.title}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-silver-400">{p.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal className="panel p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-400">Field visual · path profile</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver-500">Sketch</span>
              </div>
              <div className="mt-3">
                <PathProfile />
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver-500">From theory to accepted site</h3>
              <ol ref={ref} className="relative mt-5 space-y-6 pl-8">
                <span aria-hidden className="absolute left-[7px] top-1 bottom-1 w-px bg-line-strong" />
                <motion.span aria-hidden className="absolute left-[7px] top-1 w-px bg-gradient-to-b from-signal to-teal" style={{ height: h }} />
                {chain.map((c, i) => (
                  <li key={c} className="relative">
                    <span className="absolute -left-8 top-1 grid h-[15px] w-[15px] place-items-center rounded-full border border-signal/60 bg-ink-950">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                    <span className="font-mono text-[10px] text-silver-500">STEP 0{i + 1}</span>
                    <span className="block text-silver-100">{c}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
