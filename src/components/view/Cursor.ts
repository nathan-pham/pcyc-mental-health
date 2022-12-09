import { MathUtils, Vector2 } from "three";
import ComponentView from "../../engine/ComponentView";
import { $, $$ } from "../../engine/html";

export default class Cursor extends ComponentView {
    private el: HTMLDivElement;
    private pos = new Vector2();
    private targetPos = new Vector2();

    private initialSize: string;

    constructor() {
        super();
        this.el = $(".cursor") as HTMLDivElement;
        this.initialSize = this.el.style.getPropertyValue("--size");

        // set initial cursor position
        const elBbox = this.el.getBoundingClientRect();
        this.pos.x = elBbox.left;
        this.pos.y = elBbox.top;

        this.initEventListeners();
        this.autoExpand();
    }

    private initEventListeners() {
        addEventListener("pointermove", (e) => {
            this.targetPos.x = e.clientX;
            this.targetPos.y = e.clientY;
        });

        document.documentElement.addEventListener("mouseenter", () => {
            this.el.style.opacity = "1";
        });

        document.documentElement.addEventListener("mouseleave", () => {
            this.el.style.opacity = "0";
        });
    }

    private autoExpand() {
        $$("[data-expand]").forEach((el) => {
            el.addEventListener("mouseenter", () => this.expand());
            el.addEventListener("mouseleave", () => this.shrink());
        });
    }

    expand() {
        this.el.style.setProperty("--size", "4rem");
    }

    shrink() {
        this.el.style.setProperty("--size", this.initialSize);
    }

    update() {
        this.pos.x = MathUtils.lerp(this.pos.x, this.targetPos.x, 0.1);
        this.pos.y = MathUtils.lerp(this.pos.y, this.targetPos.y, 0.1);

        const x = this.pos.x + "px";
        const y = this.pos.y + "px";
        this.el.style.left = x;
        this.el.style.top = y;
    }
}
