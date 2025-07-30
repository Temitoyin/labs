import Gallery from "./Utils/Gallery";
import Sizes from "./Utils/Sizes";
import SmoothScroll from "./Utils/SmoothScroll";
import Timeline from "./Utils/Timeline";
import Zoom from "./Utils/Zoom";

export default class Animations {
    constructor() {
        this.mainTimeline = new Timeline();
        this.sizes = new Sizes();
        this.smoothScroll = new SmoothScroll();
        this.zoom = new Zoom(this.mainTimeline);
        this.gallery = new Gallery();

        this.sizes.on('resize', () => {
            this.resize();
            console.log('resizing')
        });
        window.animation = this;
    }


    resize() {
        this.gallery.resize();
    }
}