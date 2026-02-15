import { useState } from 'react';

import AIChatbot from './components/AIChatbot';
import Hero from './sections/Hero';
import TechCarousel from './sections/TechCarousel';
import Projects from './sections/Projects';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Admin from './pages/Admin';

function HomePage() {
  return (
    <>
      <main className="w-full">
        <Hero />
        <TechCarousel />
        <Projects />
        <Education />
        <Contact />
      </main>
      <AIChatbot />
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');

  // Check URL for admin route
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return <HomePage />;
}

export default App;
