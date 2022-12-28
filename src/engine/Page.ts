import gsap from "gsap";
import { $ } from "./html";

interface PageProps {
    id: string;
    route: string;
}

export default class Page {
    private id: string = "unknown page";
    private route: string = "/";
    private tl: gsap.core.Timeline;

    constructor({ id, route }: PageProps) {
        this.id = id;
        this.route = route;

        this.tl = this.createTimeline();
    }

    getId() {
        return this.id;
    }

    getPage() {
        return $(this.id) as HTMLElement;
    }

    getRoute() {
        return this.route;
    }

    private createTimeline() {
        const tl = gsap.timeline({
            paused: true,
        });

        if (this.route == "/") {
            const heroContent = $(".hero__content") as HTMLDivElement;
            tl.fromTo(
                heroContent,
                {
                    flexBasis:
                        getComputedStyle(heroContent).getPropertyValue(
                            "--expand"
                        ),
                },
                {
                    flexBasis:
                        getComputedStyle(heroContent).getPropertyValue(
                            "--default"
                        ),
                    ease: "Expo.easeInOut",
                }
            );
        }

        tl.fromTo(
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

        return tl;
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
