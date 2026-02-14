import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Github, ArrowRight, X } from 'lucide-react';
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 glass rounded-full text-white hover:bg-orange-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        </div>

        {/* Project Details */}
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {project.title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 glass rounded-full text-orange-400 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
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
                className="btn-outline flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={`group relative transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-2xl glass cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {/* Image Container */}
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <img
              src={project.image_url}
              alt={project.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-90' : 'opacity-60'
            }`} />

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                Featured
              </div>
            )}

            {/* Hover Content */}
            <div className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                {project.description}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 glass rounded text-orange-400 text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 4 && (
                  <span className="px-2 py-1 glass rounded text-gray-400 text-xs">
                    +{project.tech_stack.length - 4}
                  </span>
                )}
              </div>

              {/* View Project Button */}
              <button className="flex items-center gap-2 text-orange-400 font-medium text-sm group/btn">
                View Project
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom Info (Visible when not hovered) */}
          <div className={`p-4 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 glass rounded text-orange-400 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Border Glow */}
          <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
            isHovered ? 'border-orange-500/50 glow-orange' : 'border-transparent'
          }`} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectModal project={project} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
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

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-20 bg-charcoal"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500" />
            <p className="text-gray-400 max-w-xl">
              A selection of projects I've worked on. Each one represents a unique challenge and creative solution.
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-80 animate-pulse">
                <div className="h-48 bg-white/5 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Projects */}
        {!loading && featuredProjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-medium text-gray-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              Featured Projects
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {!loading && otherProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full" />
              More Projects
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + featuredProjects.length} />
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {!loading && (
          <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl text-white hover:bg-orange-500/20 transition-all duration-300 group"
            >
              <Github className="w-5 h-5" />
              View All on GitHub
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
