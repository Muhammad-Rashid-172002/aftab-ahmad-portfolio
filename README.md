# Aftab Ahmed — Telecommunications Engineer Portfolio

React 19 + TypeScript + Vite + Tailwind CSS v4, with Motion for interface animation,
Three.js / React Three Fiber for the 3D hero, and Lenis for smooth scrolling.

## Run locally

```bash
npm install        # required after this update (new dependencies were added)
npm run dev        # http://localhost:3000
npm run lint       # type-check
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Editing content

All profile information lives in **`src/data/profile.ts`** — name, role, contact, projects,
microwave chain components, expertise, experience and the research-model parameters.
Components only read from that file.

| What | Where |
| --- | --- |
| LinkedIn URL | `profile.linkedinUrl` — set to `''` to hide all LinkedIn links |
| Portrait | `public/assets/aistudio/` (`aftab-portrait.webp`, `-sm.webp`, original PNG fallback) |
| CV PDF | `public/Aftab-Ahmed-CV.pdf`, generated from `src/data/profile.ts` by `npm run cv` (`scripts/generate-cv.ts`, needs `npx playwright install chromium` once). Re-run it whenever profile content changes. The hero and Resume section link to it with *Download CV* (saves as `Aftab-Ahmed-CV.pdf`) and *View CV* (new tab). |
| SEO | `index.html` (canonical / Open Graph for `https://aftab-ahmad-portfolio.vercel.app/`), `public/og-image.jpg`, `public/robots.txt`, `public/sitemap.xml` |

## Structure

```
src/
  data/profile.ts            centralised content
  lib/                       motion tokens, hooks, smooth scroll, WPT model
  components/
    hero/                    Hero, lazy-loaded 3D scene, SVG fallback, simulated HUD
    layout/                  Navbar, Footer, Intro sequence
    sections/                Identity, Projects, Architecture, Expertise, About,
                             Experience, ResearchLab, Resume, Contact
    viz/                     interactive SVG project diagrams + hotspots
    ui/                      primitives (Reveal, Magnetic, SectionHeading…), Cursor, Live
```

## Behaviour notes

- **3D hero** (tower, dish, beam particles, relay-node constellation, radar ring) is code-split and only loads when WebGL is available; otherwise an SVG scene is shown.
  It stops rendering when scrolled off-screen and is skipped when the browser's Data Saver is on. Append `?no3d` to the URL to force the SVG fallback.
- **Reduced motion** (`prefers-reduced-motion`) disables the intro, smooth scrolling, parallax and looping animations.
- **Intro** plays once per browser session and can be skipped (button or `Esc`).
- **Contact form** has no backend: it validates input, then opens a prefilled email draft (`mailto:`) or copies the message.
- **Print**: printing the page (Ctrl/Cmd+P) prints only the résumé summary.
- **Research lab** uses a simplified, documented analytical model calibrated to the supplied parameters
  (see `src/lib/wptModel.ts`). It is an educational visualization, not a validated simulation.
- HUD values in the hero and RSL values in the architecture diagram are **illustrative**, not live telemetry.
