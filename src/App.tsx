
import { Suspense, lazy } from 'react';
import ScrollEngine from './components/ScrollEngine';
import Hero from './sections/Hero';
import TechCarousel from './sections/TechCarousel';
import Projects from './sections/Projects';
import GitHubContributions from './sections/GitHubContributions';
import Education from './sections/Education';
import Contact from './sections/Contact';

const Admin = lazy(() => import('./pages/Admin'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

function HomePage() {
  return (
    <>
      <ScrollEngine />
      <main className="w-full">
        <Hero />
        <div className="section-divider" />
        <TechCarousel />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <GitHubContributions />
        <div className="section-divider" />
        <Education />
        <div className="section-divider" />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <AIChatbot />
      </Suspense>
    </>
  );
}

function App() {
  // Check URL for admin route
  if (window.location.pathname === '/admin') {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background text-foreground">Loading Admin...</div>}>
        <Admin />
      </Suspense>
    );
  }

  return <HomePage />;
}

export default App;
