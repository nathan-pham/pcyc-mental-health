import { Group, Object3D } from "three";
import Canvas from "./Canvas";

export default class Component {
    name: string = "Untitled Component";
    object!: Object3D | Group;

    update(canvas: Canvas) {}
}
