import gsap from "gsap";
import { $ } from "../../engine/html";

export default class LanternLabel {
    private el: HTMLElement;
    private tl: GSAPTimeline;

    constructor() {
        this.el = $(".lanternLabel") as HTMLElement;
        this.tl = gsap.timeline({ paused: true }).fromTo(
            this.el,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                ease: "Expo.easeInOut",
            }
        );
    }

    setLabel(label: string) {
        this.el.innerHTML = label;
    }

    show() {
        this.tl.play();
    }

    hide() {
        this.tl.reverse();
    }
}
