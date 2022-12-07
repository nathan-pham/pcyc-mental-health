import { Group, Object3D } from "three";

export default class Component {
    name: string = "Untitled Component";
    object!: Object3D | Group;

    update() {}
}
