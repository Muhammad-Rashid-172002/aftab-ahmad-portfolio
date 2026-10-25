import { ArrowUp, ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import { navItems, profile } from '../../data/profile';
import { useAnchorClick, useScrollTo } from '../../lib/smoothScroll';

export function Footer() {
  const onAnchor = useAnchorClick();
  const scrollTo = useScrollTo();
  return (
    <footer className="no-print relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-signal/40 font-mono text-sm font-semibold text-signal-soft">{profile.monogram}</span>
              <div>
                <div className="font-semibold text-silver-50">{profile.name}</div>
                <div className="text-sm text-silver-400">{profile.title}</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver-500">
              Microwave transmission, telecom infrastructure, network operations and wireless power transfer research.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {[...navItems, { id: 'resume', label: 'Resume' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={onAnchor} className="text-silver-400 hover:text-silver-50">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm text-silver-300 hover:text-silver-50">
              <Mail className="h-4 w-4" aria-hidden /> {profile.email}
            </a>
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-silver-300 hover:text-silver-50">
                <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <button type="button" onClick={() => scrollTo(0)} className="btn btn-ghost mt-2 !min-h-[40px] text-sm" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" aria-hidden /> Back to top
            </button>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-silver-500 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span className="max-w-xl md:text-right">
            Independent personal portfolio. Huawei, Jazz, NTC, PTCL and Turnotech are named to describe work context and do not endorse this site. Diagrams and HUD values are illustrative.
          </span>
        </div>
      </div>
    </footer>
  );
}
