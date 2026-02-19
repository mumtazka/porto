import { useRef, useEffect, useState } from 'react';
import { GraduationCap, Trophy, ExternalLink, Calendar } from 'lucide-react';
import { useEducation, useAchievements } from '../hooks/useSupabase';

function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function useReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Education Entry ───────────────────────────────────────────────────── */
function EduEntry({ edu, index }: { edu: any; index: number }) {
  const { ref, visible } = useReveal();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Row: number | connector | card */}
      <div className="flex items-start gap-6 lg:gap-10">
        {/* Big ordinal number */}
        <div className="flex-shrink-0 w-14 lg:w-20 text-right">
          <span
            className="font-display font-extrabold text-5xl lg:text-7xl leading-none select-none"
            style={{ color: 'rgba(20,20,20,0.07)', letterSpacing: '-0.04em' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Vertical line + dot */}
        <div className="flex flex-col items-center pt-2 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-stone-800 ring-4 ring-stone-800/10 z-10" />
          <div className="w-px flex-1 bg-stone-200 mt-2" style={{ minHeight: 60 }} />
        </div>

        {/* Card */}
        <div className="flex-1 pb-10 group">
          <div
            className="rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-sm p-6 lg:p-8 transition-all duration-300 hover:border-stone-400 hover:shadow-sm"
          >
            {/* Date badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span className="text-xs font-medium text-stone-400 tracking-wide uppercase">
                {formatDateShort(edu.start_date)} — {formatDateShort(edu.end_date)}
              </span>
            </div>

            {/* Institution */}
            <h3 className="font-display font-bold text-xl lg:text-2xl text-stone-900 mb-1" style={{ letterSpacing: '-0.02em' }}>
              {edu.institution}
            </h3>

            {/* Degree tag */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-orange-500">{edu.degree}</span>
              {edu.field && (
                <>
                  <span className="text-stone-300">·</span>
                  <span className="text-sm text-stone-500">{edu.field}</span>
                </>
              )}
            </div>

            {/* Description */}
            {edu.description && (
              <p className="text-stone-500 text-sm leading-relaxed mt-2 line-clamp-2">{edu.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Achievement Card ──────────────────────────────────────────────────── */
function AchievementCard({ ach, index }: { ach: any; index: number }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="transition-all duration-600"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="group relative rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-sm p-5 h-full flex flex-col gap-4 transition-all duration-300 hover:border-stone-900 hover:-translate-y-1 hover:shadow-md">

        {/* Top row: year + link */}
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xs tracking-widest text-stone-400 uppercase">
            {formatYear(ach.date)}
          </span>
          {ach.credential_url && (
            <a
              href={ach.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Trophy icon + title */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="font-display font-bold text-stone-900 text-sm leading-snug" style={{ letterSpacing: '-0.015em' }}>
              {ach.title}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">{ach.issuer}</p>
          </div>
        </div>

        {/* Optional description */}
        {ach.description && (
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mt-auto">{ach.description}</p>
        )}

        {/* Bottom accent line on hover */}
        <div className="absolute bottom-0 left-5 right-5 h-px bg-stone-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
      </div>
    </div>
  );
}

/* ─── Loading skeleton ─────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-start gap-6 lg:gap-10 animate-pulse">
      <div className="w-14 lg:w-20 h-16 bg-stone-100 rounded-lg flex-shrink-0" />
      <div className="flex flex-col items-center pt-2 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-stone-200" />
        <div className="w-px h-16 bg-stone-100 mt-2" />
      </div>
      <div className="flex-1 pb-10">
        <div className="rounded-2xl border border-stone-100 bg-stone-50 p-6 space-y-3">
          <div className="h-3 bg-stone-100 rounded w-24" />
          <div className="h-6 bg-stone-100 rounded w-2/3" />
          <div className="h-4 bg-stone-100 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─────────────────────────────────────────────────────── */
export default function Education() {
  const { education, loading: eduLoading } = useEducation();
  const { achievements, loading: achLoading } = useAchievements();

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="education" className="relative py-24 overflow-hidden" style={{ background: '#f0ede5' }}>

      {/* Faint background texture circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">

        {/* ── Section Header ───────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="mb-20 transition-all duration-700"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'none' : 'translateY(24px)' }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 mb-3">Background</p>
          <h2
            className="font-display font-extrabold text-stone-900"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
          >
            Education &<br />
            <span className="text-orange-400">Achievements.</span>
          </h2>
          <p className="mt-5 text-stone-500 max-w-md leading-relaxed">
            A snapshot of my academic journey and the credentials I've earned along the way.
          </p>
        </div>

        {/* ── Education Timeline ───────────────────────────────────── */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-display font-bold text-stone-900 text-lg" style={{ letterSpacing: '-0.02em' }}>
              Education
            </h3>
          </div>

          <div>
            {eduLoading ? (
              <div className="space-y-0">
                {[0, 1, 2].map(i => <SkeletonRow key={i} />)}
              </div>
            ) : education.length === 0 ? (
              <p className="text-stone-400 text-sm pl-4">No education entries yet.</p>
            ) : (
              education.map((edu, i) => <EduEntry key={edu.id} edu={edu} index={i} />)
            )}
          </div>
        </div>

        {/* ── Achievements Grid ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-display font-bold text-stone-900 text-lg" style={{ letterSpacing: '-0.02em' }}>
              Certifications & Awards
            </h3>
          </div>

          {achLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-stone-100 bg-stone-50 h-36" />
              ))}
            </div>
          ) : achievements.length === 0 ? (
            <p className="text-stone-400 text-sm pl-4">No achievements listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <AchievementCard key={ach.id} ach={ach} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
