import {
    Clock,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Component from "./Component";

import { $ } from "./html";

interface CanvasProps {
    container: string;
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

    clock: Clock = new Clock(false);

    constructor({ container, controls }: CanvasProps) {
        this.container = $(container)! as HTMLElement;
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

    /**
     * Create renderer
     * @returns Three.js renderer
     */
    private createRenderer() {
        const renderer = new WebGLRenderer();
        renderer.setSize(this.size.width, this.size.height);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;

        this.container.appendChild(renderer.domElement);

        return renderer;
    }

    /**
     * Create scene
     * @returns Three.js scene
     */
    private createScene() {
        return new Scene();
    }

    /**
     * Create and position camera
     * @returns Three.js camera
     */
    private createCamera() {
        const r = this.size.aspectRatio;
        const camera = new PerspectiveCamera(75, r, 0.1, 1000);
        camera.position.z = 15;

        return camera;
    }

    /**
     * Add a list of objects to the scene
     * @param objects - List of component objects
     */
    add(...objects: Component[]) {
        for (const object of objects) {
            this.components.push(object);
            this.scene.add(object.object);

            object.canvas = this;
            object.onMount();
        }
    }

    /**
     * Remove an object by name
     * @param name object's name
     */
    remove(name: string) {
        // remove from component tree
        this.components = this.components.filter((c) => c.object.name !== name);

        // remove from scene
        const object = this.scene.getObjectByName(name);
        object && this.scene.remove(object);
    }

    /**
     * Get the size of the scene's container
     */
    get size() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        return {
            width,
            height,
            aspectRatio: width / height,
        };
    }

    /**
     * Add necessary event listeners
     */
    private initEventListeners() {
        addEventListener("resize", () => {
            this.renderer.setSize(this.size.width, this.size.height);
            this.camera.aspect = this.size.aspectRatio;
            this.camera.updateProjectionMatrix();
        });
    }

    /**
     * Start core animation loop
     */
    core() {
        this.clock.start();

        const animate = () => {
            // update everything
            this.controls?.update();
            for (const object of this.components) {
                object.update();
            }

            // render everything
            this.renderer.render(this.scene, this.camera);
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    /**
     * Pause animation loop
     */
    pause() {
        cancelAnimationFrame(this.animationId);
        this.clock.stop();
    }
}
