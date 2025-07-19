import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

import Lenis from 'lenis'

export default class SmoothScroll {
    constructor() {
        this.options = {
            lerp: 0.1, // Reduced for smoother integration
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            wheelMultiplier: 0.3,
            normalizeWheel: true,
        }
        this.init();
    }

    init() {
        this.lenis = new Lenis(this.options);

        // Properly integrate Lenis with ScrollTrigger
        this.lenis.on('scroll', (e) => {
            ScrollTrigger.update();
        });

        // Use gsap.ticker for consistent timing
        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // IMPORTANT: Remove this line - it breaks the integration
        // ScrollTrigger.defaults({
        //     scroller: this.lenis.el,
        // });

        // Instead, let ScrollTrigger use the window (default)
        // Lenis handles the smooth scrolling automatically

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
        console.log('animation scrolling initialized');
    }

    // Remove the duplicate raf method
    // The gsap.ticker.add handles this now

    destroy() {
        gsap.ticker.remove(this.lenis.raf);
        this.lenis.destroy();
    }

    scrollTo(target, options = {}) {
        this.lenis.scrollTo(target, options);
    }

    stop() {
        this.lenis.stop();
    }

    start() {
        console.log('starting animation scrolling');
        this.lenis.start();
    }
}