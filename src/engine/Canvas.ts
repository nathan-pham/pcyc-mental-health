import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Component from "./Component";

import { $ } from "./html";

interface CanvasProps {
    container: HTMLElement | string;
    controls: boolean;
}

export default class Canvas {
    private container: HTMLElement;

    // three.js components
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private scene: Scene;

    private animationId: number = 0;
    private controls: OrbitControls | undefined;
    private components: Component[] = [];

    constructor({ container, controls }: CanvasProps) {
        this.container =
            typeof container === "string"
                ? ($(container)! as HTMLElement)
                : container;

        this.renderer = this.createRenderer();
        this.camera = this.createCamera();
        this.scene = this.createScene();

        if (controls) {
            this.controls = new OrbitControls(
                this.camera,
                this.renderer.domElement
            );
        }

        this.initEventListeners();
    }

    private createRenderer() {
        const renderer = new WebGLRenderer();
        renderer.setSize(this.size.width, this.size.height);
        this.container.appendChild(renderer.domElement);

        return renderer;
    }

    private createScene() {
        return new Scene();
    }

    private createCamera() {
        const r = this.size.aspectRatio;
        const camera = new PerspectiveCamera(75, r, 0.1, 1000);
        camera.position.z = 5;

        return camera;
    }

    add(...objects: Component[]) {
        for (const object of objects) {
            this.components.push(object);
            this.scene.add(object.object);
        }
    }

    remove(name: string) {
        // remove from component tree
        this.components = this.components.filter((c) => c.name !== name);

        // remove from scene
        const object = this.scene.getObjectByName(name);
        object && this.scene.remove(object);
    }

    get size() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        return {
            width,
            height,
            aspectRatio: width / height,
        };
    }

    private initEventListeners() {
        addEventListener("resize", () => {
            this.renderer.setSize(this.size.width, this.size.height);
            this.camera.aspect = this.size.aspectRatio;
            this.camera.updateProjectionMatrix();
        });
    }

    core() {
        const animate = () => {
            this.controls?.update();
            for (const object of this.components) {
                object.update();
            }

            this.renderer.render(this.scene, this.camera);
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    pause() {
        cancelAnimationFrame(this.animationId);
    }
}
