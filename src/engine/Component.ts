import { Group, Object3D } from "three";
import Canvas from "./Canvas";

export default class Component {
    object!: Object3D | Group;
    canvas!: Canvas;

    onMount() {}

    onUnmount() {}

    update() {}
}

export const createComponent = (objectCreator: () => Object3D) => {
    class FunctionComponent extends Component {
        constructor() {
            super();
            this.object = objectCreator();
        }
    }

    return new FunctionComponent();
};
