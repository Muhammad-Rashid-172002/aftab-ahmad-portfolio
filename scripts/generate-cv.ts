/**
 * Generates public/Aftab-Ahmed-CV.pdf from the portfolio's own content
 * (src/data/profile.ts), so the CV never drifts from the website.
 *
 *   npm i -D playwright && npx playwright install chromium   # one-time
 *   npm run cv
 *
 * Only facts present in the portfolio are used. No dates are printed because
 * none were supplied; roles are labelled Current / Previous / Internship.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { experience, expertise, profile, projects, researchModel } from '../src/data/profile';

const root = resolve(import.meta.dirname, '..');
const SITE = 'https://aftab-ahmad-portfolio.vercel.app';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s: string) => s.replace(/\.$/, '');

/* ------------------------------------------------------------------ copy */
const summary =
  `Telecommunications Engineer working as a ${profile.role} with ${profile.affiliation} on Jazz telecom infrastructure projects. ` +
  'Hands-on experience in microwave link installation and commissioning, antenna alignment, Huawei RTN configuration through WebLCT, ' +
  'RSL optimization, LOS verification, NOC coordination and ISDP site acceptance documentation. ' +
  `${profile.degree} graduate of ${profile.institution}, with final-year research in sub-MHz inductive wireless power transfer for implantable neurostimulators.`;

// Responsibilities phrased for a CV; each line maps 1:1 to a point in profile.ts.
const roleBullets: Record<string, string[]> = {
  huawei: [
    'Install and commission microwave transmission links on Huawei RTN 905 / 950 / 980 platforms.',
    'Optimize Receive Signal Level (RSL) and verify Line-of-Sight (LOS) on microwave paths.',
    'Configure Huawei RTN equipment and perform provisioning and diagnostics using WebLCT.',
    'Coordinate with the Network Operations Center (NOC) on activities and alarm rectification.',
    'Carry out site surveys, mounting checks and cable routing, and complete acceptance documentation in ISDP.',
  ],
  turnotech: [
    'Supported telecom field deployment activities.',
    'Conducted site surveys and supported equipment staging.',
    'Performed RF cabling inspections.',
    'Supported transmission testing and prepared network quality reports.',
  ],
  ntc: [
    'Gained exposure to telecom backbones and exchange switching.',
    'Observed NOC surveillance workflows, fault detection and transmission redundancy.',
    'Studied enterprise networking infrastructure.',
  ],
  ptcl: [
    'Studied optical distribution networks and FTTN architecture.',
    'Gained exposure to fiber splicing and OTDR testing.',
    'Learned physical-layer maintenance practices for broadband access networks.',
  ],
};

const typeLabel = { Current: 'Current role', Previous: 'Previous role', Internship: 'Internship' } as const;

/* ------------------------------------------------------------------ html */
// Static (non-variable) fonts so the PDF embeds real TrueType fonts, which ATS parsers read reliably.
const font = (f: string) => pathToFileURL(resolve(root, 'node_modules/@fontsource', f)).href;
const linkedinShort = profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '');

const html = /* html */ `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${esc(profile.name)} – ${esc(profile.title)} CV</title>
<style>
${[400, 500, 600].map((w) => `@font-face { font-family: Inter; src: url(${font(`inter/files/inter-latin-${w}-normal.woff2`)}) format('woff2'); font-weight: ${w}; }`).join('\n')}
@font-face { font-family: Archivo; src: url(${font('archivo/files/archivo-latin-600-normal.woff2')}) format('woff2'); font-weight: 600; }
@page { size: A4; margin: 15mm 16mm 14mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Inter, Arial, sans-serif; font-size: 9.6pt; line-height: 1.45; color: #1e293b; }
a { color: inherit; text-decoration: none; }
header { border-bottom: 2px solid #0b1422; padding-bottom: 10px; margin-bottom: 4px; }
h1 { font-family: Archivo, Inter, sans-serif; font-size: 25pt; letter-spacing: -.02em; line-height: 1; margin: 0; color: #03050a; font-weight: 600; }
.title { margin-top: 6px; font-size: 11.5pt; font-weight: 600; color: #136a78; }
.contact { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 9pt; color: #334155; }
.contact span + span::before { content: ''; }
h2 { font-family: Archivo, Inter, sans-serif; font-size: 10.5pt; text-transform: uppercase; letter-spacing: .09em; color: #03050a; margin: 15px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #cbd5e1; font-weight: 600; }
p { margin: 0; }
.job { margin-bottom: 9px; break-inside: avoid; }
.job-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
.role { font-weight: 600; color: #03050a; font-size: 10.2pt; }
.tag { font-size: 8.4pt; color: #64748b; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.org { color: #136a78; font-weight: 500; }
ul { margin: 3px 0 0; padding-left: 15px; }
li { margin: 1.5px 0; }
.skills { display: grid; grid-template-columns: 1fr; gap: 4px; }
.skills div { break-inside: avoid; }
.skills b { color: #03050a; font-weight: 600; }
.sys { margin-top: 3px; font-size: 9pt; color: #334155; }
.proj { margin-bottom: 8px; break-inside: avoid; }
.proj-title { font-weight: 600; color: #03050a; }
.muted { color: #64748b; font-size: 8.8pt; }
</style></head>
<body>
<header>
  <h1>${esc(profile.name)}</h1>
  <div class="title">${esc(profile.title)} | ${esc(profile.role)}</div>
  <div class="contact">
    <span>${esc(profile.location)}</span>
    <span><a href="mailto:${profile.email}">${esc(profile.email)}</a></span>
    ${profile.linkedinUrl ? `<span><a href="${profile.linkedinUrl}">${esc(linkedinShort)}</a></span>` : ''}
    <span><a href="${SITE}">${SITE.replace('https://', '')}</a></span>
  </div>
</header>

<h2>Professional Summary</h2>
<p>${esc(summary)}</p>

<h2>Core Competencies</h2>
<div class="skills">
${expertise.map((c) => `  <div><b>${esc(c.title)}:</b> ${c.items.map((i) => esc(i.name)).join(', ')}.</div>`).join('\n')}
</div>

<h2>Professional Experience</h2>
${experience
  .map(
    (e) => `<div class="job">
  <div class="job-head"><span class="role">${esc(e.role)}</span><span class="tag">${typeLabel[e.type]}</span></div>
  <div class="org">${esc(e.organization)}${e.context ? ` — ${esc(e.context)}` : ''}${e.organization.includes('Pakistan') ? '' : `, ${esc(profile.location)}`}</div>
  <ul>${(roleBullets[e.id] ?? e.points).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  ${e.systems ? `<div class="sys"><b>Systems &amp; tools:</b> ${e.systems.map(esc).join(', ')}</div>` : ''}
</div>`,
  )
  .join('\n')}

<h2>Key Projects</h2>
${projects
  .map(
    (p) => `<div class="proj">
  <div class="job-head"><span class="proj-title">${esc(p.title)}</span><span class="tag">${esc(p.kind.split(' · ')[0])}</span></div>
  <p>${esc(p.description)}</p>
  <div class="sys"><b>Focus:</b> ${p.competencies.map((c) => esc(strip(c))).join('; ')}.</div>
  ${
    p.id === 'wpt'
      ? `<div class="sys"><b>Research model:</b> ${researchModel.frequencyKHz} kHz resonance, ${researchModel.separationMm} mm coil separation, coupling factor ${researchModel.coupling}, reported link efficiency ${Math.round(researchModel.efficiency * 100)}% (academic simulation model, not clinically validated).</div>`
      : ''
  }
</div>`,
  )
  .join('\n')}

<h2>Education</h2>
<div class="job">
  <div class="job-head"><span class="role">${esc(profile.degree)}</span></div>
  <div class="org">${esc(profile.institution)}, ${esc(profile.location)}</div>
  <div class="sys"><b>Final-year research:</b> ${esc(profile.research)}.</div>
</div>

<h2>Technical Tools &amp; Platforms</h2>
<p>Huawei RTN 905 / 950 / 980, Huawei WebLCT, ISDP, ODU / IDU / IF systems, DCN / ECRF, RRU / BBU, OTDR (exposure).</p>
</body></html>`;

/* ------------------------------------------------------------------ pdf */
const htmlPath = resolve(root, 'scripts/.cv.html');
writeFileSync(htmlPath, html);
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = resolve(root, 'public', profile.resumePdfFilename);
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
await browser.close();
const bytes = readFileSync(out);
console.log(`Wrote ${out} (${(bytes.length / 1024).toFixed(1)} kB)`);
