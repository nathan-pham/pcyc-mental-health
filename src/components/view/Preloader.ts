import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { $ } from "../../engine/html";

interface PreloaderProps {
    container: string;
    assetPaths: string[];
}

export default class Preloader {
    assets: Record<string, any> = {};

    private container: HTMLElement;
    private containerProgress: HTMLElement;

    private assetPaths: string[] = [];
    private assetsLoaded: number = 0;

    constructor({ assetPaths }: PreloaderProps) {
        this.container = $(".preloader") as HTMLElement;
        this.containerProgress = $(".preloader__progress") as HTMLElement;

        this.assetPaths = assetPaths;
    }

    async load() {
        for (const assetPath of this.assetPaths) {
            const extension = assetPath.split(".").pop()?.toLowerCase();
            switch (extension) {
                case "gltf":
                    this.assets[assetPath] = await this.loadGLTF(assetPath);
                    break;

                default:
                    throw new Error(
                        `Failed to load ${assetPath}, no loader defined`
                    );
            }

            this.assetsLoaded++;
            this.containerProgress.style.setProperty(
                "--progress",
                (this.assetsLoaded / this.assetPaths.length).toString()
            );
        }
    }

    loadGLTF(assetPath: string) {
        const loader = new GLTFLoader();
        return new Promise((resolve) => {
            loader.load(assetPath, (gltf) => resolve(gltf));
        });
    }

    dispose() {
        gsap.fromTo(
            this.container,
            {
                opacity: 1,
            },
            {
                opacity: 0,
                ease: "Expo.easeInOut",
                onComplete: () => {
                    this.container.remove();
                },
                delay: 1,
            }
        );
    }
}
