import { Download, FileText, Mail, MapPin, Printer, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { experience, expertise, profile } from '../../data/profile';
import { Reveal, SectionHeading } from '../ui/primitives';

/** Checks that a real PDF is served at the configured path (SPA fallbacks return HTML). */
function usePdfAvailable(url: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [url]);
  return ok;
}

export function Resume() {
  const pdf = usePdfAvailable(profile.resumePdfUrl);
  return (
    <section id="resume" aria-labelledby="resume-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="resume-title" index="08" eyebrow="Professional Resume" title="The one-page version." lead="A print-ready summary of experience, education and technical scope." />
          <Reveal className="no-print flex flex-wrap gap-3">
            <button type="button" onClick={() => window.print()} className="btn btn-ghost">
              <Printer className="h-4 w-4" aria-hidden /> Print / Save as PDF
            </button>
            {pdf ? (
              <a href={profile.resumePdfUrl} download className="btn btn-primary">
                <Download className="h-4 w-4" aria-hidden /> Download PDF
              </a>
            ) : (
              <button type="button" disabled className="btn btn-primary" aria-describedby="pdf-note">
                <Download className="h-4 w-4" aria-hidden /> Download PDF
              </button>
            )}
          </Reveal>
        </div>
        {!pdf && (
          <p id="pdf-note" className="no-print mt-3 text-right text-xs text-silver-500">
            PDF download becomes available once the résumé file is published.
          </p>
        )}

        <Reveal className="mt-10">
          <article id="resume-document" className="mx-auto max-w-4xl rounded-[var(--radius-panel)] border border-line bg-[#f4f6f9] p-6 text-[#0b1422] shadow-[0_40px_120px_-40px_rgba(79,216,235,.35)] sm:p-12">
            <header className="flex flex-col gap-6 border-b border-[#d5dbe3] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="display text-4xl font-semibold text-[#03050a]">{profile.name}</h3>
                <p className="mt-2 text-sm font-medium text-[#1a6f7c]">
                  {profile.title} · {profile.role}
                </p>
                <p className="text-sm text-[#475569]">
                  {profile.affiliation} — {profile.projectAssociation}
                </p>
              </div>
              <ul className="space-y-1 text-sm text-[#334155]">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  <a href={`mailto:${profile.email}`} className="break-all hover:underline">
                    {profile.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> {profile.location}
                </li>
                {profile.linkedinUrl && (
                  <li className="flex items-center gap-2">
                    <Linkedin className="h-3.5 w-3.5" aria-hidden />
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn profile
                    </a>
                  </li>
                )}
              </ul>
            </header>

            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              <div className="space-y-6 sm:col-span-2">
                <section>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Profile</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#1e293b]">
                    Telecommunications Engineer working with {profile.affiliation} on Jazz network infrastructure projects. Experience across microwave link installation and commissioning, antenna alignment, Huawei RTN configuration via WebLCT, RSL optimization, NOC coordination and ISDP site acceptance. Academic research in sub-MHz wireless power transfer for implantable neurostimulators.
                  </p>
                </section>
                <section>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Experience</h4>
                  <div className="mt-3 space-y-4">
                    {experience.map((e) => (
                      <div key={e.id} className="break-inside-avoid">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-semibold text-[#03050a]">{e.role}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#64748b]">{e.type}</span>
                        </div>
                        <div className="text-sm text-[#1a6f7c]">
                          {e.organization}
                          {e.context ? ` · ${e.context}` : ''}
                        </div>
                        <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[13px] text-[#334155]">
                          {e.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="space-y-6">
                <section>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Education</h4>
                  <p className="mt-2 text-sm font-semibold text-[#03050a]">{profile.degree}</p>
                  <p className="text-sm text-[#334155]">{profile.institution}</p>
                </section>
                <section>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Research</h4>
                  <p className="mt-2 text-sm text-[#334155]">{profile.research}</p>
                </section>
                {expertise.map((c) => (
                  <section key={c.id}>
                    <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">{c.title}</h4>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#334155]">{c.items.map((i) => i.name).join(' · ')}</p>
                  </section>
                ))}
              </aside>
            </div>
            <footer className="mt-8 flex items-center gap-2 border-t border-[#d5dbe3] pt-4 text-[11px] text-[#64748b]">
              <FileText className="h-3.5 w-3.5" aria-hidden /> Generated from the portfolio content. Employer names indicate work context only.
            </footer>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
