import {
    Clock,
    Fog,
    Intersection,
    Object3D,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

import Component from "./Component";
import { $ } from "./html";
import Cursor from "../components/view/Cursor";
import Pointer from "../components/Pointer";
import ComponentView from "./ComponentView";

interface CanvasProps {
    container: string;
    controls: boolean;
}

const DOWN_SCALE = 3;

export default class Canvas {
    public readonly container: HTMLElement;

    // three.js components
    private renderer: WebGLRenderer;
    private composer: EffectComposer;

    public camera: PerspectiveCamera;
    public scene: Scene;
    public controls: OrbitControls | undefined;

    private animationId: number = 0;
    private components: Component[] = [];
    private componentViews: ComponentView[] = [];

    state: Record<string, any> = {};

    clock = new Clock(false);
    raycaster = new Raycaster();
    intersections: Intersection<Object3D>[] = [];

    cursor: Cursor; // html pretty view
    pointer: Pointer; // actual 3d position

    constructor({ container, controls }: CanvasProps) {
        this.container = $(container)! as HTMLElement;

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

        this.cursor = new Cursor();
        this.pointer = new Pointer({ container: this.container });

        this.initEventListeners();
        this.resizeRenderer();
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
        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(
            this.size.width / DOWN_SCALE,
            this.size.height / DOWN_SCALE,
            false
        );
        renderer.setPixelRatio(devicePixelRatio);

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
        const scene = new Scene();
        scene.fog = new Fog(0x000000, 0.1, 50);
        return scene;
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
     * @param objects - List of Component objects
     */
    add(...objects: Component[]) {
        for (const object of objects) {
            object.canvas = this;
            object.onMount();

            this.components.push(object);
            this.scene.add(object.object);
        }
    }

    /**
     * Add a list of view (html) components to the canvas animation
     * Helps synchronize and reduce the number of requestAnimationFrames
     * @param views - List of ComponentView objects
     */
    addView(...views: ComponentView[]) {
        for (const view of views) {
            this.componentViews.push(view);
        }
    }

    /**
     * Remove an object by name
     * @param name object's name
     */
    remove(name: string) {
        // remove from components array
        const componentIdx = this.components.findIndex(
            (c) => c.object.name === name
        );
        if (componentIdx < 0) return;
        this.components.splice(componentIdx, 1);
        this.components[componentIdx].onUnmount();

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

    private resizeRenderer() {
        this.renderer.setSize(
            this.size.width / DOWN_SCALE,
            this.size.height / DOWN_SCALE,
            false
        );

        this.composer.setSize(
            this.size.width / DOWN_SCALE,
            this.size.height / DOWN_SCALE
        );

        // only update camera if aspect ratio is different
        if (this.camera.aspect !== this.size.aspectRatio) {
            this.camera.aspect = this.size.aspectRatio;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * Add necessary event listeners
     */
    private initEventListeners() {
        // new ResizeObserver(() => {
        //     this.resizeRenderer();
        //     this.pointer.resize();
        // }).observe(this.container);

        // addEventListener("resize", () => {
        //     this.resizeRenderer();
        // });

        this.resizeRenderer();
        this.pointer.initEventListeners();
    }

    /**
     * Start core animation loop
     */
    core() {
        this.clock.start();

        const animate = () => {
            this.resizeRenderer();
            this.pointer.resize();

            // update raycaster
            this.raycaster.setFromCamera(this.pointer.position, this.camera);
            this.intersections = this.raycaster.intersectObjects(
                this.scene.children,
                true
            );

            // update controls
            this.controls?.update();
            for (const object of this.components) {
                object.update();
            }

            // update other components
            for (const object of this.componentViews) {
                object.update();
            }

            // render stuff
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

    /**
     * Animate current view to a new position
     * @param position - Camera position
     * @param rotation - Camera rotation
     * @param target - Orbital controls target view
     */
    animateView(position: number[], rotation: number[], target: number[]) {
        gsap.timeline()
            .to(this.camera.position, {
                x: position[0],
                y: position[1],
                z: position[2],
                ease: "Expo.easeInOut",
            })
            .to(this.camera.rotation, {
                x: rotation[0],
                y: rotation[1],
                z: rotation[2],
                ease: "Expo.easeInOut",
            });

        if (this.controls) {
            gsap.to(this.controls.target, {
                x: target[0],
                y: target[1],
                z: target[2],
                ease: "Expo.easeInOut",
            });

            this.controls.update();
        }
    }
}
