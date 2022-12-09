import { Vector2 } from "three";

interface PointerProps {
    container: HTMLElement;
}

export default class Pointer {
    position = new Vector2();
    down = false;
    inContainer = false;

    private container: HTMLElement;
    private containerBbox: DOMRect;

    constructor({ container }: PointerProps) {
        this.container = container;
        this.containerBbox = this.container.getBoundingClientRect();
    }

    get size() {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    }

    onResize() {
        this.containerBbox = this.container.getBoundingClientRect();
    }

    initEventListeners() {
        addEventListener("pointermove", (e) => {
            this.position.x =
                ((e.clientX - this.containerBbox.left) / this.size.width) * 2 -
                1;
            this.position.y =
                -((e.clientY - this.containerBbox.top) / this.size.height) * 2 +
                1;
        });

        addEventListener("pointerdown", () => {
            this.down = true;
        });

        addEventListener("pointerup", () => {
            this.down = false;
        });

        this.container.addEventListener("mouseenter", () => {
            this.inContainer = true;
        });

        this.container.addEventListener("mouseleave", () => {
            this.inContainer = false;
        });
    }
}

// {
//     position: new Vector2(),
//     down: false,
//     inContainer: false,
// }
