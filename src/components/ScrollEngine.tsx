import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' && 'ontouchstart' in window;

/* ── Custom Cursor ─────────────────────────────────────── */
function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (IS_TOUCH) return;

        const ring = ringRef.current;
        const dot = dotRef.current;
        const text = textRef.current;
        if (!ring || !dot || !text) return;

        let mx = 0, my = 0, rx = 0, ry = 0, rafId = 0;

        const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

        const loop = () => {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            dot.style.transform = `translate(${mx}px, ${my}px)`;
            rafId = requestAnimationFrame(loop);
        };

        const onEnter = (e: Event) => {
            const label = (e.currentTarget as HTMLElement).getAttribute('data-cursor');
            ring.style.transform += ' scale(2.5)';
            ring.style.opacity = '0.15';
            dot.style.transform += ' scale(0.5)';
            if (label) { text.textContent = label; text.style.opacity = '1'; }
        };

        const onLeave = () => {
            ring.style.opacity = '0.5';
            dot.style.transform = dot.style.transform.replace(' scale(0.5)', '');
            text.style.opacity = '0';
        };

        // Use event delegation on body instead of per-element listeners
        const onBodyOver = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a, button, [data-cursor], input, textarea');
            if (target) onEnter({ currentTarget: target } as unknown as Event);
        };
        const onBodyOut = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a, button, [data-cursor], input, textarea');
            if (target) onLeave();
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.body.addEventListener('mouseover', onBodyOver, { passive: true });
        document.body.addEventListener('mouseout', onBodyOut, { passive: true });
        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMove);
            document.body.removeEventListener('mouseover', onBodyOver);
            document.body.removeEventListener('mouseout', onBodyOut);
        };
    }, []);

    if (IS_TOUCH) return null;

    return (
        <>
            <div ref={ringRef} style={{
                position: 'fixed', top: -20, left: -20, width: 40, height: 40,
                borderRadius: '50%', border: '1.5px solid rgba(249,115,22,0.6)',
                pointerEvents: 'none', zIndex: 9999, opacity: 0.5,
                mixBlendMode: 'difference', willChange: 'transform',
                transition: 'opacity 0.4s, transform 0.1s linear',
            }}>
                <div ref={textRef} style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)', fontSize: 8, fontWeight: 700,
                    color: '#F97316', letterSpacing: '0.05em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap', opacity: 0, transition: 'opacity 0.2s',
                }} />
            </div>
            <div ref={dotRef} style={{
                position: 'fixed', top: -4, left: -4, width: 8, height: 8,
                borderRadius: '50%', background: '#F97316',
                pointerEvents: 'none', zIndex: 9999, willChange: 'transform',
            }} />
        </>
    );
}

/* ── Main ScrollEngine ─────────────────────────────────── */
export default function ScrollEngine() {
    const lenisRef = useRef<Lenis | null>(null);

    // Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time: number) => { lenis.raf(time * 1000); };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);

    // Scroll-triggered animations
    useEffect(() => {
        const timer = setTimeout(() => {
            initSectionReveals();
            initProgressBar();
            initHeroEntrance();
            initDividers();
            initButtonRipples();
        }, 400);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(t => t.kill());
            document.getElementById('scroll-progress')?.remove();
        };
    }, []);

    return <CustomCursor />;
}

/* ── Section Reveals ───────────────────────────────────── */
function initSectionReveals() {
    // Batch headings — one ScrollTrigger per heading
    document.querySelectorAll('h2').forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0, filter: 'blur(6px)' },
            {
                y: 0, opacity: 1, filter: 'blur(0px)',
                duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
        );
    });

    // One batch per section for cards (avoids per-card ScrollTriggers)
    document.querySelectorAll('section').forEach(section => {
        const cards = section.querySelectorAll(':scope > div > .glass, :scope > div > .glass-strong');
        if (!cards.length) return;

        gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
            }
        );
    });
}

/* ── Scroll Progress Bar ───────────────────────────────── */
function initProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    Object.assign(bar.style, {
        position: 'fixed', top: '0', left: '0', width: '0%', height: '3px',
        background: 'linear-gradient(90deg, #F97316, #FBBF24, #06B6D4)',
        zIndex: '9998', pointerEvents: 'none', borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 10px rgba(249,115,22,0.5)',
    });
    document.body.appendChild(bar);

    gsap.to(bar, {
        width: '100%', ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
}

/* ── Hero Entrance Animation ───────────────────────────── */
function initHeroEntrance() {
    const heroH1 = document.querySelector('#home h1');
    if (!heroH1) return;

    const spans = heroH1.querySelectorAll('span');
    gsap.fromTo(spans,
        { y: 60, opacity: 0, filter: 'blur(8px)' },
        {
            y: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1, stagger: 0.12, delay: 0.3,
            ease: 'power4.out',
        }
    );
}

/* ── Section Dividers ──────────────────────────────────── */
function initDividers() {
    document.querySelectorAll('.section-divider').forEach(el => {
        gsap.fromTo(el,
            { scaleX: 0, opacity: 0 },
            {
                scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.inOut',
                scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none reverse' },
            }
        );
    });
}

/* ── Button Ripples ────────────────────────────────────── */
function initButtonRipples() {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
        const el = btn as HTMLElement;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';

        el.addEventListener('mouseenter', (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const ripple = document.createElement('span');
            Object.assign(ripple.style, {
                position: 'absolute', width: '0', height: '0', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', transform: 'translate(-50%,-50%)',
                left: `${e.clientX - rect.left}px`, top: `${e.clientY - rect.top}px`,
                pointerEvents: 'none',
            });
            el.appendChild(ripple);

            gsap.to(ripple, {
                width: 300, height: 300, opacity: 0,
                duration: 0.6, ease: 'power2.out',
                onComplete: () => ripple.remove(),
            });
        });
    });
}
