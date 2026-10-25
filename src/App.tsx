import { MotionConfig } from 'motion/react';
import { Hero } from './components/hero/Hero';
import { Footer } from './components/layout/Footer';
import { IntroSequence } from './components/layout/IntroSequence';
import { Navbar } from './components/layout/Navbar';
import { About } from './components/sections/About';
import { Architecture } from './components/sections/Architecture';
import { Contact } from './components/sections/Contact';
import { Experience } from './components/sections/Experience';
import { Expertise } from './components/sections/Expertise';
import { Identity } from './components/sections/Identity';
import { Projects } from './components/sections/Projects';
import { ResearchLab } from './components/sections/ResearchLab';
import { Resume } from './components/sections/Resume';
import { Cursor } from './components/ui/Cursor';
import { ScrollProgress } from './components/ui/primitives';
import { SmoothScrollProvider } from './lib/smoothScroll';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <IntroSequence />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        <main id="main">
          <Hero />
          <Identity />
          <Projects />
          <Architecture />
          <Expertise />
          <About />
          <Experience />
          <ResearchLab />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
