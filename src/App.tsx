
import AIChatbot from './components/AIChatbot';
import Sidebar from './components/Sidebar';
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
      <Sidebar />
      <main className="w-full lg:pl-20 pb-16 lg:pb-0">
        <Hero />
        <TechCarousel />
        <Projects />
        <GitHubContributions />
        <Education />
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
