import { Mesh, MeshPhongMaterial, PlaneGeometry } from "three";
import Component from "../engine/Component";

export default class GardenFloor extends Component {
    constructor() {
        super();
        this.object = new Mesh(
            new PlaneGeometry(100, 100, 10, 10),
            new MeshPhongMaterial({ color: "#3f3f3b" })
        );
    }

    onMount() {
        this.object.rotation.x = -Math.PI / 2;
        this.object.position.y = -1.5;
    }
}
