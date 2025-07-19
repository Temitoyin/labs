import Gallery from "./Utils/Gallery";
import SmoothScroll from "./Utils/SmoothScroll";
import Timeline from "./Utils/Timeline";
import Zoom from "./Utils/Zoom";

export default class Animations {
    constructor() {
        this.mainTimeline = new Timeline()
        this.smoothScroll = new SmoothScroll();
        this.zoom = new Zoom(this.mainTimeline);
        this.gallery = new Gallery();
        window.animation = this;
    }
}