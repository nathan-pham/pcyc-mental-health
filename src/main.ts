import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

import Preloader from "./engine/Preloader";
import Canvas from "./engine/Canvas";
import "./css/globals.css";
import "./css/index.css";

// initialize assets
const preloader = new Preloader({
    container: ".preloader",
    assetPaths: ["/garden/scene.gltf"],
});

await preloader.load();
preloader.dispose();
// class Box extends Component {
//     name = "box";

//     constructor() {
//         super();
//         this.object = new Mesh(
//             new BoxGeometry(1, 1, 1),
//             new MeshBasicMaterial({ color: "red" })
//         );
//     }
// }

const canvas = new Canvas({
    container: ".hero__canvas",
    controls: true,
});

canvas.core();
