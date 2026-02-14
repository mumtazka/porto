import { useRef, useEffect, useState } from 'react';
import { Calendar, Award, GraduationCap, ExternalLink } from 'lucide-react';
import { useEducation } from '../hooks/useSupabase';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function EducationCard({ edu, index, isLeft }: { edu: any; index: number; isLeft: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center justify-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 items-center w-full">
        {/* Left Side */}
        <div className={`${isLeft ? 'text-right' : 'order-3 text-left'}`}>
          {isLeft && (
            <div 
              className="glass rounded-2xl p-6 card-hover cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-start gap-4 justify-end">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                  <p className="text-orange-400 font-medium mb-2">{edu.degree}</p>
                  <p className="text-gray-400 text-sm mb-3">{edu.field}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm justify-end">
                    <Calendar className="w-4 h-4" />
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </div>
                  {edu.description && (
                    <p className="text-gray-400 text-sm mt-3 line-clamp-2">{edu.description}</p>
                  )}
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 glass">
                  <img
                    src={edu.certificate_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop'}
                    alt={edu.institution}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Border Glow */}
              <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
                isHovered ? 'border-orange-500/50 glow-orange' : 'border-transparent'
              }`} />
            </div>
          )}
        </div>

        {/* Center Timeline */}
        <div className="relative flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-orange-500 z-10" />
          <div className="w-0.5 h-full bg-gradient-to-b from-orange-500 to-transparent absolute top-4" />
        </div>

        {/* Right Side */}
        <div className={`${!isLeft ? 'text-left' : 'order-1 text-right'}`}>
          {!isLeft && (
            <div 
              className="relative glass rounded-2xl p-6 card-hover cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 glass">
                  <img
                    src={edu.certificate_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop'}
                    alt={edu.institution}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                  <p className="text-orange-400 font-medium mb-2">{edu.degree}</p>
                  <p className="text-gray-400 text-sm mb-3">{edu.field}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </div>
                  {edu.description && (
                    <p className="text-gray-400 text-sm mt-3 line-clamp-2">{edu.description}</p>
                  )}
                </div>
              </div>

              {/* Border Glow */}
              <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
                isHovered ? 'border-orange-500/50 glow-orange' : 'border-transparent'
              }`} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden w-full">
        <div 
          className="relative glass rounded-2xl p-5 card-hover"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start gap-4">
            {/* Timeline Dot */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <div className="w-0.5 flex-1 bg-gradient-to-b from-orange-500 to-transparent mt-2" />
            </div>

            <div className="flex-1 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 glass">
                  <img
                    src={edu.certificate_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop'}
                    alt={edu.institution}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </div>
                </div>
              </div>

              <p className="text-orange-400 font-medium mb-1">{edu.degree}</p>
              <p className="text-gray-400 text-sm mb-2">{edu.field}</p>
              
              {edu.description && (
                <p className="text-gray-500 text-sm line-clamp-2">{edu.description}</p>
              )}
            </div>
          </div>

          {/* Border Glow */}
          <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
            isHovered ? 'border-orange-500/50 glow-orange' : 'border-transparent'
          }`} />
        </div>
      </div>
    </div>
  );
}

export default function Education() {
  const { education, loading } = useEducation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative py-20 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Learning Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Education & <span className="text-gradient">Achievements</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500" />
            <p className="text-gray-400 max-w-xl">
              My academic background and professional certifications that shaped my expertise.
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-white/5 rounded w-1/3" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education Timeline */}
        {!loading && education.length > 0 && (
          <div className="space-y-0 lg:space-y-8">
            {education.map((edu, index) => (
              <EducationCard
                key={edu.id}
                edu={edu}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        )}

        {/* Certifications CTA */}
        {!loading && (
          <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-4 glass rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-white font-semibold">View All Certifications</h4>
                <p className="text-gray-400 text-sm">Check out my complete credential portfolio</p>
              </div>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
