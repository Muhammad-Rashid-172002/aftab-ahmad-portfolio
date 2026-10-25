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
| Résumé PDF | Put the real file at `public/resume/aftab-ahmed-resume.pdf`. The *Download PDF* button enables itself automatically once that file is served. |

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

- **3D hero** is code-split and only loads when WebGL is available; otherwise an SVG scene is shown.
  It stops rendering when scrolled off-screen. Append `?no3d` to the URL to force the SVG fallback.
- **Reduced motion** (`prefers-reduced-motion`) disables the intro, smooth scrolling, parallax and looping animations.
- **Intro** plays once per browser session and can be skipped (button or `Esc`).
- **Contact form** has no backend: it validates input, then opens a prefilled email draft (`mailto:`) or copies the message.
- **Print**: the *Print / Save as PDF* button prints only the résumé document.
- **Research lab** uses a simplified, documented analytical model calibrated to the supplied parameters
  (see `src/lib/wptModel.ts`). It is an educational visualization, not a validated simulation.
- HUD values in the hero and RSL values in the architecture diagram are **illustrative**, not live telemetry.
