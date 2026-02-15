import { useRef, useEffect, useState } from 'react';
import { useScrollDirection } from '../hooks/useScrollAnimation';

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

const techStack: TechItem[] = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'TypeScript', icon: '🔷', color: '#3178C6' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248' },
  { name: 'Tailwind', icon: '💨', color: '#06B6D4' },
  { name: 'Next.js', icon: '▲', color: '#FFFFFF' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'AWS', icon: '☁️', color: '#FF9900' },
  { name: 'GraphQL', icon: '◈', color: '#E10098' },
  { name: 'Redis', icon: '🔴', color: '#DC382D' },
];

const techStackRow2: TechItem[] = [
  { name: 'Vue.js', icon: '💚', color: '#4FC08D' },
  { name: 'Angular', icon: '🅰️', color: '#DD0031' },
  { name: 'Express', icon: '🚂', color: '#FFFFFF' },
  { name: 'Prisma', icon: '◭', color: '#2D3748' },
  { name: 'Firebase', icon: '🔥', color: '#FFCA28' },
  { name: 'Git', icon: '🔀', color: '#F05032' },
  { name: 'Figma', icon: '🎨', color: '#F24E1E' },
  { name: 'Linux', icon: '🐧', color: '#FCC624' },
  { name: 'Nginx', icon: '🌿', color: '#009639' },
  { name: 'Jest', icon: '🃏', color: '#C21325' },
  { name: 'Vite', icon: '⚡', color: '#646CFF' },
  { name: 'Supabase', icon: '🔷', color: '#3ECF8E' },
];

function TechCard({ tech, index }: { tech: TechItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 mx-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative group px-6 py-4 glass rounded-xl cursor-pointer transition-all duration-300 ${isHovered ? 'scale-110 glow-orange' : ''
          }`}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Glow Effect on Hover */}
        <div
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: `radial-gradient(circle at center, ${tech.color}20 0%, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-3">
          <span className="text-2xl" style={{ filter: isHovered ? `drop-shadow(0 0 8px ${tech.color})` : 'none' }}>
            {tech.icon}
          </span>
          <span className="text-gray-900 font-medium whitespace-nowrap">{tech.name}</span>
        </div>

        {/* Border Glow */}
        <div
          className={`absolute inset-0 rounded-xl border transition-all duration-300 pointer-events-none ${isHovered ? 'border-orange-500/50' : 'border-transparent'
            }`}
        />
      </div>
    </div>
  );
}

export default function TechCarousel() {
  const { scrollDirection } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Duplicate tech stack for seamless loop
  const duplicatedTechStack = [...techStack, ...techStack];
  const duplicatedTechStackRow2 = [...techStackRow2, ...techStackRow2];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-20 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* Section Title */}
        <div className={`text-center mb-12 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm font-medium mb-4">
            My Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tech Stack & <span className="text-gradient">Tools</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Technologies I use to bring ideas to life. Always learning and exploring new tools.
          </p>
        </div>

        {/* Carousel Row 1 - Scrolls Left */}
        <div className="relative mb-6">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

          <div
            ref={row1Ref}
            className={`flex ${isVisible ? 'animate-scroll-left' : ''}`}
            style={{
              animationPlayState: isVisible ? 'running' : 'paused',
              animationDirection: scrollDirection === 'up' ? 'reverse' : 'normal',
            }}
          >
            {duplicatedTechStack.map((tech, index) => (
              <TechCard key={`row1-${index}`} tech={tech} index={index} />
            ))}
          </div>
        </div>

        {/* Carousel Row 2 - Scrolls Right */}
        <div className="relative">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

          <div
            ref={row2Ref}
            className={`flex ${isVisible ? 'animate-scroll-right' : ''}`}
            style={{
              animationPlayState: isVisible ? 'running' : 'paused',
              animationDirection: scrollDirection === 'up' ? 'normal' : 'reverse',
            }}
          >
            {duplicatedTechStackRow2.map((tech, index) => (
              <TechCard key={`row2-${index}`} tech={tech} index={index} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-16 px-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-1">5+</div>
            <div className="text-gray-600 text-sm">Years Experience</div>
          </div>
          <div className="w-px h-16 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-1">50+</div>
            <div className="text-gray-600 text-sm">Projects Completed</div>
          </div>
          <div className="w-px h-16 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-1">20+</div>
            <div className="text-gray-600 text-sm">Technologies</div>
          </div>
          <div className="w-px h-16 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-1">30+</div>
            <div className="text-gray-600 text-sm">Happy Clients</div>
          </div>
        </div>
      </div>
    </section>
  );
}
