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
            loading="lazy"
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
      className="w-full h-full min-h-[500px] flex flex-col relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] hover:border-white transition-all duration-500 hover:-translate-y-2"
      onClick={onClick}
      data-cursor="view"
    >
      {/* Thumbnail Section */}
      <div className="h-[300px] w-full relative p-3 pb-0">
        <div className="w-full h-full relative overflow-hidden rounded-[2rem] shadow-sm bg-gray-100">
          {/* Dark Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />

          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-20 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur text-orange-600 text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg border border-orange-100/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              FEATURED
            </span>
          </div>

          {/* View Action Overlay */}
          <div className="absolute bottom-4 right-4 z-20 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-[150ms]">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 pt-6 flex flex-col relative z-20">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-orange-400 transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 text-[15px] leading-relaxed mb-6 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.slice(0, 4).map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-xs text-gray-600 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.02)] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span
                className="px-3 py-1.5 bg-gray-50/80 border border-gray-100 rounded-xl text-xs text-gray-500 font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                style={{ transitionDelay: `${4 * 75}ms` }}
              >
                +{project.tech_stack.length - 4}
              </span>
            )}
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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Featured <span className="text-gradient">Showcase</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A continuous stream of my recent development work and creative experiments.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-32">
            {[1, 2].map((i) => (
              <div key={i} className="w-full h-[550px] glass rounded-3xl animate-pulse bg-gray-100/50" />
            ))}
          </div>
        )}

        {/* Featured Projects - 2 Column Grid */}
        {!loading && featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-32">
            {featuredProjects.map((project) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProjectId(project.id)}
              />
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">


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
      {
        selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
        )
      }
    </section >
  );
}
