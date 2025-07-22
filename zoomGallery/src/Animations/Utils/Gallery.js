import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin)


export default class Gallery {
    constructor() {
        this.galleryImageContainer = document.querySelectorAll('.gallery-image-container');
        this.galleryImages = document.querySelectorAll('.gallery-image');
        this.backgroundImages = document.querySelectorAll('.background-image');
        this.textItems = document.querySelectorAll('.text-item'); // Add text items selector
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Position wheel on the right side of screen
        this.wheelCenterX = this.width / 2 // Move further right (80% from left)
        this.wheelCenterY = this.height / 2; // Center vertically initially
        this.radius = this.width / 2 * 0.8;// Larger radius for more spacing

        this.createSVGPath();
        this.positionImagesOnPath();
        this.scrollMotionPath();
        // this.animateClosingSection();
    }
    createSVGPath() {
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'fixed';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        this.svg.style.pointerEvents = 'none';
        this.svg.style.zIndex = '9999';
        this.svg.style.opacity = '0.3'; // Make it semi-transparent for debugging

        // Create a semicircle path for the right side only
        // Start from top-right, go through right side, to bottom-right
        const pathData = `M ${this.wheelCenterX} ${this.wheelCenterY - this.radius}
                         A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX} ${this.wheelCenterY + this.radius}`;

        this.circlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.circlePath.setAttribute('d', pathData);
        this.circlePath.setAttribute('fill', 'none');
        this.circlePath.setAttribute('stroke', 'red');
        this.circlePath.setAttribute('stroke-width', '2');
        this.circlePath.setAttribute('id', 'circlePath');

        // Also create a full circle for visual reference
        const fullCircleData = `M ${this.wheelCenterX + this.radius} ${this.wheelCenterY}
                               A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX - this.radius} ${this.wheelCenterY}
                               A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX + this.radius} ${this.wheelCenterY}`;

        this.fullCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.fullCircle.setAttribute('d', fullCircleData);
        this.fullCircle.setAttribute('fill', 'none');
        this.fullCircle.setAttribute('stroke', 'rgba(255, 0, 0, 0.2)');
        this.fullCircle.setAttribute('stroke-width', '1');

        this.svg.appendChild(this.fullCircle);
        this.svg.appendChild(this.circlePath);
        document.body.appendChild(this.svg);
    }

    positionImagesOnPath() {
        const count = this.galleryImages.length;

        this.galleryImageContainer.forEach((img, index) => {
            // Position images evenly distributed along the entire semicircle path
            // From 0 (top of semicircle) to 1 (bottom of semicircle)
            const progress = index / (count - 1); // This gives even distribution from 0 to 1
            img.style.transformOrigin = 'center center';

            console.log(progress, 'progress');
            // Set initial position using MotionPath
            gsap.set(img, {
                motionPath: {
                    path: this.circlePath,
                    start: 2,
                    end: 0,
                    autoRotate: false,
                    offsetX: -img.offsetWidth / 2,
                    offsetY: -img.offsetHeight / 2
                }
            });
        });
    }


    // Scroll motion path for gallery images
    scrollMotionPath() {
        gsap.to(this.galleryImageContainer, {
            motionPath: {
                path: this.circlePath,
                autoRotate: false,
                alignOrigin: [-0.5, -0.5]
            },
            transformOrigin: "50% 50%",
            stagger: 0.03,
            scrollTrigger: {
                trigger: ".gallery-wrapper",
                start: "top bottom",
                end: "bottom top",
                scrub: 7,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: () => {
                    this.updateActiveBackground();
                },
                onLeaveBack: () => {
                    console.log('Leaving back, removing active background');
                    this.removeActiveBackground();
                }
            }
        }, '#zoom-timeline+=1');
    }


    removeActiveBackground() {
        const activeImage = Array.from(this.backgroundImages).find(img =>
            img.classList.contains('isactive')
        );

        if (activeImage) {
            activeImage.classList.remove('isactive');
            console.log('Removed active from current background image');
            return true;
        }

        return false;
    }


    updateActiveBackground() {
        const screenCenterY = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        this.galleryImageContainer.forEach((img, index) => {
            const rect = img.getBoundingClientRect();
            const imgCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(imgCenterY - screenCenterY);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        // Update background images with flash effect on change
        let hasChanged = false;
        this.backgroundImages.forEach((img, index) => {
            const wasActive = img.classList.contains('isactive');
            if (index === closestIndex && !wasActive) {
                img.classList.add('isactive');
                hasChanged = true;
            }
            else if (index !== closestIndex && wasActive) {
                img.classList.remove('isactive');
            }
        });

    }
    animateClosingSection() {
        gsap.fromTo(".closing-section",
            {
                y: "100vh",
                opacity: 1
            },
            {
                y: "0vh",
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".gallery-wrapper",
                    start: "top 90%",
                    end: "bottom center",
                    scrub: 7,
                    markers: true,
                    id: "closingSection",
                    invalidateOnRefresh: true,

                }
            }
        );
    }

    resize() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.wheelCenterX = this.width / 2;
        this.wheelCenterY = this.height / 2;
        this.radius = this.width / 2 * 0.8;

        // Update SVG path
        const pathData = `M ${this.wheelCenterX} ${this.wheelCenterY - this.radius}
                         A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX} ${this.wheelCenterY + this.radius}`;
        this.circlePath.setAttribute('d', pathData);

        this.fullCircle.setAttribute('d', `M ${this.wheelCenterX + this.radius} ${this.wheelCenterY}
                               A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX - this.radius} ${this.wheelCenterY}
                               A ${this.radius} ${this.radius} 0 0 1 ${this.wheelCenterX + this.radius} ${this.wheelCenterY}`);


        // Update positions of images
        this.positionImagesOnPath();
    }



}