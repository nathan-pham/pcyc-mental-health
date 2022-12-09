import { MathUtils } from "three";
import ComponentView from "../../engine/ComponentView";
import { $ } from "../../engine/html";

interface MusicCanvasProps {
    container: string;
    barsCount?: number;
}

export default class MusicCanvas extends ComponentView {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private barsCount: number;
    private barSize = 6;
    private counter = 0;

    constructor({ container, barsCount = 10 }: MusicCanvasProps) {
        super();
        this.container = $(container) as HTMLElement;
        this.barsCount = barsCount;

        // init canvas
        const { canvas, ctx } = this.createCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        this.initEventListeners();
    }

    get size() {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    }

    private initEventListeners() {}

    private createCanvas() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // update resolution
        const { width, height } = this.size;
        const scale = devicePixelRatio;
        Object.assign(canvas.style, {
            with: `${width}px`,
            height: `${height}px`,
        });
        Object.assign(canvas, {
            width: Math.floor(width * scale),
            height: Math.floor(height * scale),
        });
        ctx.scale(scale, scale);

        this.container.appendChild(canvas);
        return { canvas, ctx };
    }

    drawBar(x: number, height: number) {
        const ctx = this.ctx;
        const y = this.size.height - height;
        const r = this.barSize / 2;

        // draw bar
        ctx.fillStyle = "black";
        ctx.fillRect(x - r, y, this.barSize, height);

        // add rounded cap
        ctx.beginPath();
        ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.counter += 0.03;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.size.width, this.size.height);
        for (let i = 0; i < this.barsCount; i++) {
            const x = MathUtils.lerp(
                0,
                this.size.width,
                (i + 0.5) / this.barsCount
            );
            this.drawBar(x, (Math.sin(i + this.counter) + 1) * 10);
        }
    }
}
