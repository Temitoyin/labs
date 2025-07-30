import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Timeline {
    constructor(scrollTriggerOptions = {}) {
        gsap.registerPlugin(ScrollTrigger);

        const defaults = {
            trigger: ".timeline-container",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            markers: false
        };

        this.options = { ...defaults, ...scrollTriggerOptions };
        this.timeline = gsap.timeline({
            scrollTrigger: this.options
        });
    }

    to(targets, vars, position) {
        return this.timeline.to(targets, vars, position);
    }

    from(targets, vars, position) {
        return this.timeline.from(targets, vars, position);
    }

    fromTo(targets, fromVars, toVars, position) {
        return this.timeline.fromTo(targets, fromVars, toVars, position);
    }

    set(targets, vars, position) {
        return this.timeline.set(targets, vars, position);
    }
}