import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' && 'ontouchstart' in window;

/* ── Morphing Cursor ───────────────────────────────────── */
function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (IS_TOUCH) return;

        const ring = ringRef.current;
        const dot = dotRef.current;
        const label = labelRef.current;
        if (!ring || !dot || !label) return;

        let mx = 0, my = 0, rx = 0, ry = 0;
        let rafId = 0;
        let state = 'default';
        let hovered: HTMLElement | null = null;

        const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

        const loop = () => {
            let tx = mx, ty = my;

            // Magnetic pull toward hovered element center
            if (hovered && (state === 'button' || state === 'link' || state === 'labeled')) {
                const r = hovered.getBoundingClientRect();
                tx = mx + (r.left + r.width / 2 - mx) * 0.35;
                ty = my + (r.top + r.height / 2 - my) * 0.35;
            }

            const speed = state === 'default' || state === 'text' || state === 'heading' ? 0.12 : 0.08;
            rx += (tx - rx) * speed;
            ry += (ty - ry) * speed;

            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

            rafId = requestAnimationFrame(loop);
        };

        // Resolve cursor state from hovered element
        const resolve = (el: Element): [string, string?] => {
            const dc = el.closest('[data-cursor]');
            if (dc) return ['labeled', dc.getAttribute('data-cursor') || ''];
            if (el.closest('button, .btn-primary, .btn-outline')) return ['button'];
            if (el.closest('a[href]')) return ['link'];
            if (el.closest('input, textarea')) return ['input'];
            if (el.closest('.glass, .glass-strong')) return ['card'];
            if (el.closest('img, video')) return ['media'];
            if (el.closest('h1, h2, h3')) return ['heading'];
            if (el.closest('p')) return ['text'];
            return ['default'];
        };

        const apply = (s: string, text?: string) => {
            if (state === s) return;
            state = s;
            ring.dataset.state = s;
            dot.dataset.state = s;
            label.textContent = text || '';
            label.dataset.show = text ? '1' : '0';
        };

        const onOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            const [s, t] = resolve(el);
            hovered = el.closest('button, a, [data-cursor], .glass, .glass-strong') as HTMLElement || null;
            apply(s, t);
        };

        const onLeaveDoc = () => { hovered = null; apply('default'); };
        const onDown = () => { ring.dataset.pressed = '1'; };
        const onUp = () => { ring.dataset.pressed = '0'; };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onOver, { passive: true });
        document.addEventListener('mouseleave', onLeaveDoc);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseleave', onLeaveDoc);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    if (IS_TOUCH) return null;

    return (
        <>
            <div ref={ringRef} className="cursor-ring" data-state="default" data-pressed="0">
                <div ref={labelRef} className="cursor-label" data-show="0" />
            </div>
            <div ref={dotRef} className="cursor-dot" data-state="default" />
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
