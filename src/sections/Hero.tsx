import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Download, Code, Database, Layout, Server } from 'lucide-react';
import { useTypingAnimation } from '../hooks/useScrollAnimation';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { displayedText, isComplete } = useTypingAnimation(
    'I build scalable web applications and create exceptional digital experiences. Passionate about clean code, modern technologies, and solving complex problems.',
    30,
    500
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden bg-charcoal">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating Code Snippets - hidden on mobile */}
        <div className={`hidden sm:block absolute top-32 right-20 glass px-4 py-2 rounded-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
          <code className="text-xs text-cyan-400 font-mono">const dev = new Developer();</code>
        </div>
        <div className={`hidden sm:block absolute bottom-40 left-20 glass px-4 py-2 rounded-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1000ms' }}>
          <code className="text-xs text-orange-400 font-mono">&lt;FullStack /&gt;</code>
        </div>
        <div className={`hidden lg:block absolute top-1/3 right-1/3 glass px-4 py-2 rounded-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1200ms' }}>
          <code className="text-xs text-amber-400 font-mono">npm run build:success</code>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 pb-24 lg:pb-16 lg:py-0 lg:pl-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="order-2 lg:order-1">
            {/* Greeting */}
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            </div>

            {/* Name */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <span className="text-gray-900">Mumtaz</span>
              <br />
              <span className="text-gray-900">Kholafiyan </span>
              <span className="text-cyan-400">Alfan</span>
            </h1>

            {/* Title */}
            <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-xl sm:text-2xl text-gray-900 font-light">Full Stack Developer</span>
              <div className="h-px flex-1 bg-gradient-to-l from-orange-500 to-transparent" />
            </div>

            {/* Description with Typing Effect */}
            <p className={`text-gray-600 text-lg leading-relaxed mb-8 min-h-[80px] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              {displayedText}
              {!isComplete && (
                <span className="inline-block w-0.5 h-5 bg-orange-500 ml-1 animate-blink" />
              )}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap gap-4 mb-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
              <button
                onClick={scrollToProjects}
                className="group btn-primary flex items-center gap-2"
                data-cursor="explore"
              >
                See My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline flex items-center gap-2" data-cursor="download">
                <Download className="w-4 h-4" />
                Resume
              </button>
            </div>

            {/* Location Badge */}
            <div className={`flex items-center gap-2 text-gray-600 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1000ms' }}>
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Based in Yogyakarta, Indonesia</span>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className={`order-1 lg:order-2 flex justify-center lg:justify-end transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '400ms' }}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-3xl blur-2xl animate-pulse" />

                {/* Glass Card */}
                <div className="relative w-full h-full glass-strong rounded-3xl overflow-hidden animate-float">
                  {/* Real Profile Photo */}
                  <img
                    src="/mumtaz-photo.jpg"
                    alt="Mumtaz Kholafiyan Alfan"
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Border Gradient */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-gradient opacity-50" />
                </div>

                {/* Floating Tech Icons */}
                <div className="absolute -top-4 -right-4 w-14 h-14 glass rounded-xl flex items-center justify-center animate-bounce-subtle">
                  <Code className="w-7 h-7 text-orange-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 glass rounded-xl flex items-center justify-center animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
                  <Database className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="absolute top-1/2 -right-8 w-12 h-12 glass rounded-lg flex items-center justify-center animate-bounce-subtle" style={{ animationDelay: '1s' }}>
                  <Layout className="w-6 h-6 text-amber-400" />
                </div>
                <div className="absolute top-1/4 -left-8 w-12 h-12 glass rounded-lg flex items-center justify-center animate-bounce-subtle" style={{ animationDelay: '1.5s' }}>
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
              </div>

              {/* Decorative Rings */}
              <div className="absolute -inset-4 border border-orange-500/20 rounded-[2rem] animate-spin-slow" />
              <div className="absolute -inset-8 border border-amber-500/10 rounded-[2.5rem] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
