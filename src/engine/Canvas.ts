import {
    Clock,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Component from "./Component";
import { $ } from "./html";

interface CanvasProps {
    container: string;
    controls: boolean;
}

export default class Canvas {
    private container: HTMLElement;
    private containerBbox: DOMRect;

    // three.js components
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private scene: Scene;
    private composer: EffectComposer;

    private animationId: number = 0;
    private controls: OrbitControls | undefined;
    private components: Component[] = [];

    clock = new Clock(false);
    mouse = {
        x: 0,
        y: 0,
    };

    constructor({ container, controls }: CanvasProps) {
        this.container = $(container)! as HTMLElement;
        this.containerBbox = this.container.getBoundingClientRect();

        this.renderer = this.createRenderer();
        this.camera = this.createCamera();
        this.scene = this.createScene();

        this.composer = this.createComposer();

        if (controls) {
            this.controls = new OrbitControls(
                this.camera,
                this.renderer.domElement
            );
        }

        this.initEventListeners();
    }

    private createComposer() {
        const composer = new EffectComposer(this.renderer);
        composer.addPass(new RenderPass(this.scene, this.camera));

        const bloomPass = new UnrealBloomPass(
            new Vector2(this.size.width, this.size.height),
            1.5,
            1,
            0.85
        );

        composer.addPass(bloomPass);
        return composer;
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
            this.containerBbox = this.container.getBoundingClientRect();
            this.renderer.setSize(this.size.width, this.size.height);
            this.composer.setSize(this.size.width, this.size.height);
            this.camera.aspect = this.size.aspectRatio;
            this.camera.updateProjectionMatrix();
        });

        addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX - this.containerBbox.left;
            this.mouse.y = e.clientY - this.containerBbox.top;
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
            this.composer.render();
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
