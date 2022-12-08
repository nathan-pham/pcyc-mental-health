import "./css/globals.css";
import "./css/index.css";

import Preloader from "./components/view/Preloader";
import Canvas from "./engine/Canvas";
import GardenModel from "./components/GardenModel";

import GardenFloor from "./components/GardenFloor";
import { defaultView } from "./sceneData";

// initialize assets
const preloader = new Preloader({
    container: ".preloader",
    assetPaths: ["/garden/scene.gltf"],
});

await preloader.load();
preloader.dispose();

const canvas = new Canvas({
    container: ".hero__canvas",
    controls: true,
});

canvas.add(
    new GardenModel({
        gltf: preloader.assets["/garden/scene.gltf"],
    }),
    new GardenFloor()
);

canvas.animateView(
    defaultView.position,
    defaultView.rotation,
    defaultView.target
);

window.generatePos = () => {
    const r = (a: number[]) => a.map((a) => parseFloat(a.toFixed(2)));
    console.log(
        JSON.stringify({
            position: r(canvas.camera.position.toArray()),
            rotation: r(
                canvas.camera.rotation
                    .toArray()
                    .filter((t) => typeof t === "number") as number[]
            ),
            target: r(canvas.controls!.target.toArray()),
        })
    );
};

canvas.core();
