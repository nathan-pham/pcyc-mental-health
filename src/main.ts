import "./css/globals.css";
import "./css/index.css";

import Preloader from "./components/view/Preloader";
import Canvas from "./engine/Canvas";
import GardenModel from "./components/GardenModel";

import GardenFloor from "./components/GardenFloor";
import { defaultView } from "./sceneData";
import MusicCanvas from "./components/view/MusicCanvas";

// initialize classes
const preloader = new Preloader({
    assetPaths: ["/garden/scene.gltf", "/silk_touch.mp3"],
});

await preloader.load();

const canvas = new Canvas({
    container: ".hero__canvas",
    controls: true,
});

const music = new MusicCanvas({
    container: ".hero__content__music",
    music: preloader.assets["/silk_touch.mp3"],
});

preloader.onComplete(() =>
    canvas.animateView(
        defaultView.position,
        defaultView.rotation,
        defaultView.target
    )
);

preloader.dispose();

canvas.add(
    new GardenModel({
        gltf: preloader.assets["/garden/scene.gltf"],
    }),
    new GardenFloor()
);

// todo: see apps + animate in side view
// todo: finish apps

canvas.addView(canvas.cursor, music);
canvas.core();

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
