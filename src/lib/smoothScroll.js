import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP here just in case, though usually done in components
gsap.registerPlugin(ScrollTrigger);

let lenis;

export function initSmoothScroll() {
    // Prevent double initialization
    if (lenis) return;

    lenis = new Lenis({
        duration: 1.5, // Made it slightly "heavier" for that elegant feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical', 
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false, // Mobile is already smooth
        touchMultiplier: 2,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    // This ensures they update in perfect sync
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Turn off GSAP's default lag smoothing to prevent conflicts
    gsap.ticker.lagSmoothing(0);
}