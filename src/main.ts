import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

import Canvas from "./engine/Canvas";
import "./css/globals.css";
import "./css/index.css";
import Component from "./engine/Component";

class Box extends Component {
    name = "box";

    constructor() {
        super();
        this.object = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: "red" })
        );
    }
}

const canvas = new Canvas({
    container: ".hero__canvas",
    controls: true,
});

canvas.add(new Box());

canvas.core();
