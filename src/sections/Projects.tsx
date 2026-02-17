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

function FeaturedProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      className="flex-shrink-0 w-[400px] h-[550px] relative group cursor-pointer overflow-hidden rounded-3xl glass-strong border border-white/40 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Image Half */}
      <div className="h-1/2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold rounded-full border border-orange-100 shadow-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            FEATURED
          </span>
        </div>
      </div>

      {/* Content Half */}
      <div className="h-1/2 p-6 flex flex-col relative bg-white/50 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-xs text-gray-500">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center text-orange-500 font-medium text-sm group/btn">
            View Project <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
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
    document.documentElement.style.setProperty('--scroll-duration', '40s');

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

  // Create duplicates for seamless loop, ensure minimum length
  const carouselItems = featuredProjects.length > 0
    ? [...featuredProjects, ...featuredProjects, ...featuredProjects] // Triple up to ensure enough content for smooth loop
    : [];

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

      <div className="relative z-10 w-full">

        {/* Section Header */}
        <div className={`text-center mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-500 text-sm font-bold tracking-wide mb-6 border border-orange-100">
            SELECTED WORKS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Featured <span className="text-gradient">Showcase</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A continuous stream of my recent development work and creative experiments.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex gap-8 overflow-hidden px-12 pb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[400px] h-[550px] glass rounded-3xl animate-pulse bg-gray-100/50" />
            ))}
          </div>
        )}

        {/* Featured Projects - Infinite Carousel Layout */}
        {!loading && featuredProjects.length > 0 && (
          <div className="mb-32 relative w-full overflow-hidden group">
            {/* Fade Gradients at Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal/30 to-transparent z-[5] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal/30 to-transparent z-[5] pointer-events-none" />

            {/* Carousel Track */}
            <div className="flex gap-8 animate-scroll-left hover-pause w-max px-8 pl-12 py-4">
              {carouselItems.map((project, index) => (
                <FeaturedProjectCard
                  key={`${project.id}-${index}`}
                  project={project}
                  onClick={() => setSelectedProjectId(project.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
          {/* Other Projects - Grid Layout */}
          {!loading && otherProjects.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-gray-200 flex-1" />
                <h3 className="text-2xl font-bold text-gray-900">Archive</h3>
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
      </div>

      {/* Modal is global to the section */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
      )}
    </section>
  );
}
