import gsap from "gsap";
import { $ } from "./html";

interface PageProps {
    id: string;
}

export default class Page {
    private id: string = "unknown page";
    private tl: gsap.core.Timeline;

    constructor({ id }: PageProps) {
        this.id = id;
        this.tl = this.createTimeline();
    }

    getId() {
        return this.id;
    }

    getPage() {
        return $(this.id) as HTMLElement;
    }

    private createTimeline() {
        return gsap
            .timeline({
                paused: true,
            })
            .fromTo(
                `${this.id} > *`,
                {
                    opacity: 0,
                    x: -100,
                },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.1,
                    ease: "Expo.easeInOut",
                }
            );
    }

    // internal life cycle methods
    async _onMount() {
        ($(this.id) as HTMLElement).dataset.active = "true";
        await this.tl.play();
    }

    async _onUnmount() {
        await this.tl.reverse();
        delete ($(this.id) as HTMLElement).dataset.active;
    }

    onMount() {}
    onUnmount() {}
}
