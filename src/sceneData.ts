interface LanternRecord {
    position: [number, number, number];
    rotation: [number, number, number];
    target: [number, number, number];
    label: string;
}

export const lanternData: Record<string, LanternRecord> = {
    Cylinder013: {
        position: [-1.18, -0.68, 3.33],
        rotation: [-0.31, -0.68, -0.2],
        target: [1.06, -1.54, 0.7],
        label: "Chat to Learn",
    },
    Cylinder012: {
        position: [-0.15, -0.11, 1.7],
        rotation: [-1.37, 1.09, 1.34],
        target: [-1.94, -1.03, 1.51],
        label: "Chat",
    },
    Cylinder011: {
        position: [-1.15, 4.74, -0.59],
        rotation: [-2.73, -0.79, -2.84],
        target: [0.61, 4.04, 1],
        label: "Chat",
    },
    Cylinder010: {
        position: [-0.9, 3.37, -0.22],
        rotation: [-2.94, 0.79, 2.99],
        target: [-1.96, 3.16, 0.8],
        label: "Chat",
    },
    Cylinder009: {
        position: [0.8, 4.43, -0.74],
        rotation: [-0.68, -0.54, -0.4],
        target: [1.33, 3.87, -1.43],
        label: "Chat",
    },
    Cylinder002: {
        position: [-2.37, 2.17, 0.08],
        rotation: [-0.69, -0.56, -0.41],
        target: [-0.57, 0.35, -2.13],
        label: "Chat",
    },
};

export const lanternNames = Object.keys(lanternData);

export const defaultView = {
    position: [3.8, 2.5, 6.7],
    rotation: [-0.36, 0.49, 0.17],
    target: [0, 0, 0],
};
