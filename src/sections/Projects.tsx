import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Github, ArrowRight, X, Layers } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import type { Project } from '../types/database';

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-strong rounded-3xl animate-scale-in border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 glass rounded-full text-gray-900 hover:bg-orange-500 transition-colors z-10 hover:rotate-90 duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image */}
        <div className="relative h-64 sm:h-96 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
        </div>

        {/* Project Details */}
        <div className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {project.title}
              </h3>
              {project.featured && (
                <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-600 text-xs font-semibold tracking-wider rounded-full uppercase">
                  Featured Project
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center gap-2 text-sm px-5 py-2.5"
                >
                  <Github className="w-4 h-4" />
                  Code
                </a>
              )}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg mb-8 max-w-3xl">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 glass rounded-xl text-gray-700 text-sm font-medium border border-gray-200/50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project, index, total, openModal }: { project: Project; index: number; total: number; openModal: () => void }) {
  // Calculate offset for the sticky stacking effect
  const cardTopOffset = 100 + (index * 40);

  return (
    <div
      className="sticky transition-all duration-500"
      style={{
        top: `${cardTopOffset}px`,
        marginBottom: `${(total - index - 1) * 100}px`, // Reduced margin for tighter stacking
        zIndex: index + 10
      }}
    >
      <div
        className="group relative grid lg:grid-cols-2 gap-0 lg:gap-8 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 will-change-transform transform hover:-translate-y-2"
      >
        {/* Content Column */}
        <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1 relative overflow-hidden">
          {/* Decorative Number */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 opacity-[0.03] text-[6rem] leading-none font-black text-gray-900 select-none pointer-events-none">
            {(index + 1).toString().padStart(2, '0')}
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase mb-8 w-fit border border-orange-100/50">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse focus:animate-none" />
              Featured Project
            </span>

            <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 transition-all duration-300">
              {project.title}
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-100">
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 5 && (
                <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-100">
                  +{project.tech_stack.length - 5}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={openModal}
                className="btn-primary group/btn shadow-lg shadow-orange-500/20 px-8 py-4 rounded-xl text-base"
              >
                View Details
                <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200"
                  aria-label="View Code"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}

              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200"
                  aria-label="Live Demo"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div
          className="relative h-64 lg:h-auto min-h-[300px] lg:min-h-[450px] overflow-hidden order-1 lg:order-2 cursor-pointer clip-path-slant"
          onClick={openModal}
        >
          <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />

          <img
            src={project.image_url}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
            <span className="px-8 py-4 bg-white/20 backdrop-blur-md rounded-full text-white font-medium border border-white/30 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-white/30">
              Explore Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StandardProjectCard({ project, index, openModal }: { project: Project; index: number; openModal: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openModal}
    >
      <div className="relative overflow-hidden rounded-2xl glass cursor-pointer h-full flex flex-col hover:border-orange-500/30 transition-colors duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 bg-charcoal overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">

        {/* Section Header */}
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-500 text-sm font-bold tracking-wide mb-6 border border-orange-100">
            SELECTED WORKS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Crafting Digital <span className="text-gradient relative inline-block">
              Perfection
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Every project is a journey of solving problems with elegant code and intuitive design.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="glass rounded-[2rem] h-96 animate-pulse bg-gray-100/50" />
            ))}
          </div>
        )}

        {/* Featured Projects - Sticky Stack Layout */}
        {!loading && featuredProjects.length > 0 && (
          <div className="mb-32 space-y-24 sm:space-y-0">
            <div className="relative flex flex-col gap-8 lg:gap-0">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={featuredProjects.length}
                  openModal={() => setSelectedProjectId(project.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects - Grid Layout */}
        {!loading && otherProjects.length > 0 && (
          <div className="relative mt-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-gray-200 flex-1" />
              <h3 className="text-2xl font-bold text-gray-900">More Projects</h3>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => (
                <StandardProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  openModal={() => setSelectedProjectId(project.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center mt-24">
          <a
            href="https://github.com/mumtazka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
          >
            <Github className="w-5 h-5" />
            <span>Explore full archive on GitHub</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Modal is global to the section */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
      )}
    </section>
  );
}
