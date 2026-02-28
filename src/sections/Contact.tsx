import { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, Linkedin, Github, Instagram, Twitter, Heart, CheckCircle, Loader2 } from 'lucide-react';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { useMessages } from '../hooks/useSupabase';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]' },
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:bg-[#333] hover:text-white hover:border-[#333]' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]' },
  { icon: WhatsappIcon, href: 'https://wa.me', label: 'WhatsApp', color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { sendMessage, loading } = useMessages();
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { success } = await sendMessage({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    if (success) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 bg-charcoal overflow-hidden"
    >
      {/* Dynamic Background subtle elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[40rem] h-[40rem] bg-orange-500/5 rounded-full blur-[120px] mix-blend-multiply animate-pulse object-cover" />
        <div className="absolute bottom-1/4 right-0 w-[35rem] h-[35rem] bg-cyan-500/5 rounded-full blur-[100px] mix-blend-multiply animate-pulse" />

        {/* Sophisticated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 mb-4 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase">Contact Me</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Let's Work <span className="text-gradient">Together</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <p className="text-gray-600 max-w-xl text-base sm:text-lg font-medium">
              Have a project in mind? Let's create something amazing together.
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-cyan-500/50 to-transparent" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Info */}
          <div className={`lg:col-span-5 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              Ready for your next big thing?
            </h3>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              I'm always excited to work on new challenges and collaborate with creative minds.
              Whether you have a specific project in mind or just want to chat about possibilities,
              I'd love to hear from you.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="group relative overflow-hidden flex items-center gap-4 glass rounded-xl p-4 border border-black/[0.05] hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(249,115,22,0.15)] bg-white/40">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div className="relative z-10 flex-1">
                  <p className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">Email</p>
                  <a href="mailto:mumtazalfan1307@gmail.com" className="text-gray-900 text-base font-bold hover:text-orange-500 transition-colors block truncate">
                    mumtazalfan1307@gmail.com
                  </a>
                </div>
              </div>

              <div className="group relative overflow-hidden flex items-center gap-4 glass rounded-xl p-4 border border-black/[0.05] hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.15)] bg-white/40">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center border border-cyan-200 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-sm">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">Location</p>
                  <p className="text-gray-900 text-base font-bold">Yogyakarta, Indonesia</p>
                </div>
              </div>

              <div className="group relative overflow-hidden flex items-center gap-4 glass rounded-xl p-4 border border-black/[0.05] hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(251,191,36,0.15)] bg-white/40">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                  <Phone className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">Phone</p>
                  <a href="tel:+6285801214943" className="text-gray-900 text-base font-bold hover:text-amber-600 transition-colors block">
                    +62 858 0121 4943
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-px bg-gray-300"></span>
                Connect with me
                <span className="w-6 h-px bg-gray-300"></span>
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 bg-white border border-gray-200 rounded-xl text-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] overflow-hidden ${social.color}`}
                      aria-label={social.label}
                      data-cursor={social.label}
                    >
                      <Icon className="w-5 h-5 relative z-10 transition-colors duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className={`lg:col-span-7 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/60 to-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-cyan-500/5 blur-xl opacity-50 rounded-3xl -z-10" />

              <div className="bg-white/70 backdrop-blur-xl rounded-[1.4rem] p-6 sm:p-8 border border-white/40 relative overflow-hidden z-10">
                {/* Decorative form elements */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                {isSubmitted ? (
                  <div className="text-center py-12 px-6 relative z-10 rounded-2xl bg-white/50 border border-white/40 shadow-sm backdrop-blur-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shadow-[0_8px_16px_rgba(52,211,153,0.15)]">
                      <CheckCircle className="w-10 h-10 text-emerald-500 drop-shadow-sm" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Message Sent!</h4>
                    <p className="text-gray-600 text-base max-w-sm mx-auto font-medium">
                      Thank you for reaching out. I'll get back to you with lightning speed! ⚡
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-orange-600">
                        Your Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full bg-white/90 border ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'} rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-red-500 text-sm font-medium flex items-center gap-2 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-cyan-600">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`w-full bg-white/90 border ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20'} rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-red-500 text-sm font-medium flex items-center gap-2 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-amber-600">
                        Your Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell me about your amazing project idea..."
                          className={`w-full bg-white/90 border ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-amber-500 focus:ring-amber-500/20'} rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 resize-none shadow-sm`}
                        />
                      </div>
                      {errors.message && (
                        <p className="mt-2 text-red-500 text-sm font-medium flex items-center gap-2 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative group overflow-hidden rounded-lg bg-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)] shadow-sm border-0"
                      data-cursor="send"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative px-6 py-3 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span className="text-white font-semibold tracking-wide">Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-white font-semibold tracking-wide group-hover:-translate-y-0.5 transition-transform">Send Message</span>
                            <Send className="w-4 h-4 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Enhancements */}
      <footer className="relative z-10 mt-32 pt-12 pb-8 border-t border-black/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-gray-600 font-semibold bg-white/50 py-2 px-6 rounded-full border border-black/5 hover:border-black/10 transition-colors shadow-sm">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse-slow" />
              <span>in Yogyakarta</span>
            </div>

            <div className="flex bg-white/40 rounded-full p-1 border border-black/5 shadow-sm">
              <a href="#home" className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-white/60 transition-all">
                Home
              </a>
              <a href="#projects" className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-white/60 transition-all">
                Projects
              </a>
              <a href="#contact" className="px-6 py-2 text-sm font-bold text-orange-600 bg-white shadow-sm rounded-full">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 text-center pt-8 border-t border-black/5">
            <p className="text-gray-500 text-sm font-semibold tracking-wide">
              © {new Date().getFullYear()} Mumtaz Kholafiyan Alfan. Ignite your possibilities.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
