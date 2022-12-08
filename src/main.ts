import { BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial } from "three";

import Preloader from "./engine/Preloader";
import Canvas from "./engine/Canvas";
import "./css/globals.css";
import "./css/index.css";
import GardenModel from "./components/GardenModel";
import { createComponent } from "./engine/Component";

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
    })

    // createComponent(() => {
    //     const directionalLight = new DirectionalLight(0xffffff, 1);
    //     directionalLight.position.set(5, 5, 5);
    //     directionalLight.castShadow = true;
    //     return directionalLight;
    // })
    // createComponent()("light")
);

canvas.core();
