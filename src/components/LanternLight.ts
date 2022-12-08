import { Group, PointLight, SpotLight, Vector3 } from "three";
import Component from "../engine/Component";

interface LanternLightProps {
    position: Vector3;
}

export default class LanternLight extends Component {
    private position: Vector3;
    private spotLightRef: SpotLight;

    constructor({ position }: LanternLightProps) {
        super();

        this.position = position;
        this.object = new Group();

        // add refs
        this.spotLightRef = this.createSpotLight();
        this.object.add(this.spotLightRef);
        this.object.add(this.createPointLight());
    }

    private createPointLight() {
        const pointLight = new PointLight(0xffffff, 0.07);
        pointLight.castShadow = true;
        pointLight.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        return pointLight;
    }

    private createSpotLight() {
        const spotLight = new SpotLight(0xffffff, 0.4);
        spotLight.angle = Math.PI / 6;
        spotLight.castShadow = true;
        spotLight.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        // point straight down
        const target = spotLight.target;
        target.position.set(this.position.x, -100, this.position.y);
        target.updateMatrix();
        target.updateMatrixWorld();

        return spotLight;
    }

    getSpotLight() {
        return this.spotLightRef;
    }
}

// createComponent(() => {

// }),
// createComponent(() => {
//     // create spotlight

//     this.spotLights.push(spotLight);

//     return spotLight;
// })
