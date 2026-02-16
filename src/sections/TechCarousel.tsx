import { useRef, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface TechItem {
  id: number;
  name: string;
  color: string;
  path: string;
}

export default function TechCarousel() {
  const [techStack, setTechStack] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTechStack();

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

  const fetchTechStack = async () => {
    try {
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching tech stack:', error);
      } else {
        setTechStack(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <section className="py-32 bg-charcoal min-h-[60vh] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </section>;
  }

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
              transform: `translateX(${scrollPos - (techStack.length * 50)}px)`, // Adjusted offset dynamic based on count
              transition: 'transform 0.1s linear'
            }}
          >
            {techStack.map((tech, index) => {
              return (
                <div
                  key={tech.name || index}
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
