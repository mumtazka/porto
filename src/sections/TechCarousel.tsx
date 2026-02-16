import { useRef, useEffect, useState } from 'react';

interface TechItem {
  name: string;
  // Color kept for hover effects or future use, but icons will be gray outlines by default
  color: string;
  path: string;
}

const techStack: TechItem[] = [
  {
    name: 'Linux',
    color: '#FCC624',
    // Outline Tuxish
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-1.5 0-3 1-3 3 0 2 1.5 3 3 3s3-1 3-3c0-2-1.5-3-3-3zm0 12c-2.5 0-5-1.5-5-4 0-1.5 1-2.5 2-2.5h6c1 0 2 1 2 2.5 0 2.5-2.5 4-5 4z"
  },
  {
    name: 'Vite',
    color: '#646CFF',
    // Lightning Bolt
    path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
  },
  {
    name: 'React',
    color: '#61DAFB',
    // Atom
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 2c0 2.2 2.7 4 6 4s6-1.8 6-4-2.7-4-6-4-6 1.8-6 4z"
  },
  {
    name: 'Tailwind',
    color: '#06B6D4',
    // Waves
    path: "M4 12c0-2 2-2 4 0s2 4 4 4 2-2 4-4 2-4 4-2 M4 6c0-2 2-2 4 0s2 4 4 4 2-2 4-4 2-4 4-2"
  },
  {
    name: 'Supabase',
    color: '#3ECF8E',
    // Bolt/Drop
    path: "M12 2L4 12h8l-2 10 10-10h-8l2-10z"
  },
  {
    name: 'Git',
    color: '#F05032',
    // Branch
    path: "M16 12h-2v-4h-2c-1.1 0-2 .9-2 2v5l-3-3-1.4 1.4 5.4 5.4 5.4-5.4-1.4-1.4-3 3V12z M7 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  },
  {
    name: 'Node.js',
    color: '#339933',
    // Hexagon
    path: "M12 2l9 5v10l-9 5-9-5V7l9-5z M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.3 0-4.6.6-6 1.7V17h12v-2.3c-1.4-1.1-3.7-1.7-6-1.7z"
  },
  {
    name: 'GitHub',
    color: '#181717',
    // Octocat Outline (simplified)
    path: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.98 1.02-2.68-.1-.28-.45-1.29.1-2.68 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.4.1 2.68.64.7 1.02 1.57 1.02 2.68 0 3.83-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.17 22 16.42 22 12A10 10 0 0 0 12 2z"
  },
  {
    name: 'Netlify',
    color: '#00C7B7',
    // Geometric
    path: "M4 4l6 10-6 6-4-10 4-6zm16 0l-6 10 6 6 4-10-4-6zm-8 16l-6-10h12l-6 10z"
  },
  {
    name: 'Google Console',
    color: '#4285F4',
    // Cloud/Hexagon mix (GCP style)
    path: "M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5l6.5 3.6v7.8L12 19.5 5.5 15.9V8.1L12 4.5zM8 11h8M8 14h5"
  },
  {
    name: 'Cloudflare',
    color: '#F38020',
    // Cloud
    path: "M18 10h-1.26A5.002 5.002 0 0 0 8 10c0 .17.02.34.05.5a3 3 0 0 0-2.05 5.46L6 16h12a4 4 0 0 0 0-8z"
  }
];

export default function TechCarousel() {
  const [scrollPos, setScrollPos] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate scroll relative to the section
        const offset = window.innerHeight - rect.top;
        setScrollPos(offset * 0.5); // 0.5 is the speed factor
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-32 bg-charcoal overflow-hidden min-h-[60vh] flex flex-col justify-center"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm font-medium mb-4">
            My Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tech Stack & <span className="text-gradient">Tools</span>
          </h2>
        </div>

        {/* Scroll Driven & Waving Row */}
        <div className="relative w-full overflow-visible flex justify-center items-center py-10">
          <div
            className="flex items-center gap-8 will-change-transform"
            style={{
              transform: `translateX(${scrollPos - 600}px)`, // Adjusted offset for more items
              transition: 'transform 0.1s linear'
            }}
          >
            {techStack.map((tech, index) => {
              return (
                <div
                  key={tech.name}
                  className="relative group w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0"
                >
                  {/* Vertical Waving Animation */}
                  <div
                    className="w-full h-full animate-float glass rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-110 border border-transparent hover:border-gray-500/30 shadow-sm"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 stroke-gray-600 group-hover:stroke-gray-900"
                      fill="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={tech.path} />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                      {tech.name}
                    </span>

                    {/* Hover Glow Effect (Subtle Gray) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-500/0 to-gray-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
