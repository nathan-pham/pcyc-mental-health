import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { $ } from "../../engine/html";

interface PreloaderProps {
    assetPaths: string[];
}

export default class Preloader {
    assets: Record<string, any> = {};

    private el: HTMLElement;
    private elProgress: HTMLElement;

    private assetPaths: string[] = [];
    private assetsLoaded: number = 0;

    private onCompleteCb: () => void = () => {};

    constructor({ assetPaths }: PreloaderProps) {
        this.el = $(".preloader") as HTMLElement;
        this.elProgress = $(".preloader__progress") as HTMLElement;

        this.assetPaths = assetPaths;
    }

    async load() {
        for (const assetPath of this.assetPaths) {
            this.assets[assetPath] = await this.decideLoader(assetPath);
            this.assetsLoaded++;
            this.elProgress.style.setProperty(
                "--progress",
                (this.assetsLoaded / this.assetPaths.length).toString()
            );
        }
    }

    decideLoader(assetPath: string) {
        const extension = assetPath.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "gltf":
                return this.loadGLTF(assetPath);

            case "mp3":
                return this.loadAudio(assetPath);

            default:
                throw new Error(
                    `Failed to load ${assetPath}, no loader defined`
                );
        }
    }

    loadGLTF(assetPath: string) {
        const loader = new GLTFLoader();
        return new Promise((resolve) => {
            loader.load(assetPath, (gltf) => resolve(gltf));
        });
    }

    loadAudio(assetPath: string) {
        const audio = new Audio();
        return new Promise((resolve) => {
            audio.addEventListener("canplay", () => resolve(audio));
            audio.src = assetPath;
        });
    }

    onComplete(onCompleteCb: () => void) {
        this.onCompleteCb = onCompleteCb;
    }

    dispose() {
        gsap.fromTo(
            this.el,
            {
                opacity: 1,
            },
            {
                opacity: 0,
                ease: "Expo.easeInOut",
                onComplete: () => {
                    this.el.remove();
                    this.onCompleteCb();
                },
                delay: 1,
            }
        );
    }
}
