import { Object3D, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import Component from "../engine/Component";
import LanternLight from "./LanternLight";
import { defaultView, lanternData, lanternNames } from "../sceneData";

interface GardenModelProps {
    gltf: GLTF;
}

export default class GardenModel extends Component {
    private gltf: GLTF;
    private lanterns: Object3D[] = [];
    private spotLights: Object3D[] = [];
    private animationOffsets: number[] = [];
    private initialPositions: Vector3[] = [];

    private targetRotationX: number = 0;
    private selectedLantern: string | null = null;

    constructor({ gltf }: GardenModelProps) {
        super();
        this.gltf = gltf;
        this.object = this.gltf.scene;
    }

    private enableShadows() {
        // manage lighting
        this.object.castShadow = true;
        this.object.receiveShadow = true;
        this.object.position.y = -2.5;
        this.object.updateMatrixWorld(true);
    }

    private initLanterns() {
        // get lanterns, lantern positions, and animation offsets
        for (const name of lanternNames) {
            const lantern = this.object.getObjectByName(name);
            if (lantern) {
                this.lanterns.push(lantern);
                this.animationOffsets.push((Math.random() - 0.5) * 100);
                this.initialPositions.push(lantern.position.clone());

                const position = new Vector3(0, 0, 0);
                lantern.getWorldPosition(position);

                // add lighting to lanterns
                const lanternLight = new LanternLight({ position });
                this.spotLights.push(lanternLight.getSpotLight());
                this.canvas.add(lanternLight);
            }
        }
    }

    onMount() {
        this.enableShadows();
        this.initLanterns();

        // add event listeners
        addEventListener("pointerdown", () => {
            if (
                this.selectedLantern &&
                lanternData.hasOwnProperty(this.selectedLantern)
            ) {
                const lantern = lanternData[this.selectedLantern];
                this.canvas.animateView(
                    lantern.position,
                    lantern.rotation,
                    lantern.target
                );
            } else {
                this.canvas.animateView(
                    defaultView.position,
                    defaultView.rotation,
                    defaultView.target
                );
            }
        });
    }

    private updateCursor() {
        if (this.canvas.pointerInView()) {
            if (this.selectedLantern) {
                this.canvas.cursor.expand();
                this.canvas.container.style.cursor = "pointer";
            } else {
                this.canvas.cursor.shrink();
                this.canvas.container.style.cursor = "auto";
            }
        }
    }

    private updateSelectedLantern() {
        // get selected lantern
        this.selectedLantern = null;
        for (const intersection of this.canvas.intersections) {
            for (const name of lanternNames) {
                if (intersection.object.name.includes(name)) {
                    this.selectedLantern = name;
                }
            }
        }
    }

    private updateLanternPositions() {
        for (let i = 0; i < this.lanterns.length; i++) {
            const lantern = this.lanterns[i];
            const spotLight = this.spotLights[i];
            const animationOffset = this.animationOffsets[i];
            const initialPosition = this.initialPositions[i];

            lantern.position.y =
                initialPosition.y +
                Math.sin(
                    this.canvas.clock.getElapsedTime() * 2 + animationOffset
                ) *
                    15;

            const position = new Vector3(0, 0, 0);
            lantern.getWorldPosition(position);
            spotLight.position.y = position.y;
        }
    }

    update() {
        this.updateSelectedLantern();
        this.updateLanternPositions();
        this.updateCursor();
    }
}
