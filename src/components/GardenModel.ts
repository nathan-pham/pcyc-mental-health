import { Object3D, PointLight, SpotLight, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import Component, { createComponent } from "../engine/Component";

const lanternNames = [2, 9, 10, 11, 12, 13].map(
    (name) => `Cylinder${name.toString().padStart(3, "0")}`
);

interface GardenModelProps {
    gltf: GLTF;
}

export default class GardenModel extends Component {
    private gltf: GLTF;
    private lanterns: Object3D[] = [];
    private spotLights: Object3D[] = [];
    private animationOffsets: number[] = [];
    private initialPositions: Vector3[] = [];

    constructor({ gltf }: GardenModelProps) {
        super();
        this.gltf = gltf;
        this.object = this.gltf.scene;
    }

    onMount() {
        this.object.castShadow = true;
        this.object.receiveShadow = true;
        this.object.position.y = -2.5;
        this.object.updateMatrixWorld(true);

        // get lanterns, lantern positions, and animation offsets
        for (const name of lanternNames) {
            const lantern = this.object.getObjectByName(name);
            if (lantern) {
                this.lanterns.push(lantern);
                this.animationOffsets.push((Math.random() - 0.5) * 100);
                this.initialPositions.push(lantern.position.clone());

                const position = new Vector3(0, 0, 0);
                lantern.getWorldPosition(position);

                this.canvas.add(
                    createComponent(() => {
                        const pointLight = new PointLight(0xffffff, 0.07);
                        pointLight.castShadow = true;
                        pointLight.position.set(
                            position.x,
                            position.y,
                            position.z
                        );
                        return pointLight;
                    }),
                    createComponent(() => {
                        // create spotlight
                        const spotLight = new SpotLight(0xffffff, 0.4);
                        spotLight.angle = Math.PI / 6;
                        spotLight.castShadow = true;
                        spotLight.position.set(
                            position.x,
                            position.y,
                            position.z
                        );

                        // point straight down
                        const target = spotLight.target;
                        target.position.set(position.x, -100, position.y);
                        target.updateMatrix();
                        target.updateMatrixWorld();

                        this.spotLights.push(spotLight);

                        return spotLight;
                    })
                );
            }
        }
    }

    update() {
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
}
