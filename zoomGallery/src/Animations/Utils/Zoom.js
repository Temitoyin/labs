
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Zoom {

    constructor(timeline) {
        gsap.registerPlugin(ScrollTrigger);

        this.leftTextContainer = document.querySelectorAll('.span-leftContainer');
        this.rightTextContainer = document.querySelectorAll('.span-rightContainer');
        this.container = document.querySelector('.zoom-text');
        this.containerWidth = this.container?.scrollWidth || 0;
        this.viewportWidth = window.innerWidth;
        // this.scrollDistance = this.containerWidth + this.viewportWidth;
        this.zoomImages = document.querySelectorAll(".zoom-image");
        this.zoomImageContainer = document.querySelector(".zoom-images");

        this.timeline = timeline;

        console.log(this.timeline,)
        this.animateSync()

    }

    animateSync() {

        gsap.timeline({
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: ".zoom-area",
                pin: true,
                scrub: true,
                start: "top top",
                end: "bottom center",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const leftTextSpeed = 1;
                    const rightTextSpeed = 1.4// Adjust this value
                    const leftTextProgress = Math.min(progress * leftTextSpeed, 1);
                    const rightTextProgress = Math.min(progress * rightTextSpeed, 1);

                    // Animate texts
                    gsap.set(this.leftTextContainer, { xPercent: -this.containerWidth * leftTextProgress });
                    gsap.set(this.rightTextContainer, { xPercent: this.containerWidth * rightTextProgress });

                    // Animate zoom images
                    this.zoomImages.forEach((img, index) => {
                        const totalImages = this.zoomImages.length;
                        const speed = 1;
                        const adjustedProgress = Math.min(progress * speed, 1);
                        const easedProgress = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress);
                        const layerMultiplier = 0.5 + (totalImages - 1 - index) * 0.15;
                        const targetScale = 1;
                        const currentScale = easedProgress * targetScale * (1 + layerMultiplier * (1 - easedProgress));

                        gsap.set(img, { scale: currentScale });

                    });
                }
            }
        }, '#zoom-timeline');
    }


}
