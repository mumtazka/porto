
import AIChatbot from './components/AIChatbot';
import ScrollEngine from './components/ScrollEngine';
import Hero from './sections/Hero';
import TechCarousel from './sections/TechCarousel';
import Projects from './sections/Projects';
import GitHubContributions from './sections/GitHubContributions';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Admin from './pages/Admin';

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
      <AIChatbot />
    </>
  );
}

function App() {
  // Check URL for admin route
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return <HomePage />;
}

export default App;
