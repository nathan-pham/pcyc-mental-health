import { $ } from "../../../engine/html";
import Page from "../../../engine/Page";

export default class Maps extends Page {
    private mounted = false;

    constructor(props: any) {
        super(props);
    }

    static parseCSV(content: string) {
        const [header, ...lines] = content.split("\n");
        const parseRow = (row: string) =>
            row
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length);

        return {
            headings: parseRow(header),
            data: lines.map((line) => parseRow(line)),
        };
    }

    private createMap() {
        const placerCounty = new google.maps.LatLng(39.0915751, -120.8039474);
        const map = new google.maps.Map(
            $(this.getPage(), ".map") as HTMLDivElement,
            {
                disableDefaultUI: true,
                center: placerCounty,
                zoom: 6,
            }
        );

        return map;
    }

    private createHeatmap(
        map: google.maps.Map,
        heatmapData: google.maps.visualization.WeightedLocation[]
    ) {
        const heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 50,
        });

        heatmap.setMap(map);
    }

    async onMount() {
        if (this.mounted) return;

        const map = this.createMap();

        // load heat map & markers
        const { headings, data } = Maps.parseCSV(
            await fetch("./suicide_map_cleaned.csv").then((res) => res.text())
        );
        const heatmapData: google.maps.visualization.WeightedLocation[] = [];
        const markers: google.maps.Marker[] = [];
        for (const row of data) {
            const position = new google.maps.LatLng(
                parseInt(row[headings.indexOf("Latitude")]),
                parseInt(row[headings.indexOf("Longitude")])
            );
            const suicideRate = parseInt(row[headings.indexOf("Suicide Rate")]);
            const totalSuicides = row[headings.indexOf("Count")];
            const county = row[headings.indexOf("County")];

            heatmapData.push({
                location: position,
                weight: suicideRate,
            });

            const marker = new google.maps.Marker({
                position,
                title: `${county} County\nSuicide Rate: ${suicideRate}\nTotal Suicides: ${totalSuicides}`,
            });

            marker.setMap(map);
            marker.setVisible(false);

            markers.push(marker);
        }

        this.createHeatmap(map, heatmapData);

        google.maps.event.addListener(map, "zoom_changed", () => {
            const zoom = map.getZoom();
            if (zoom) {
                for (const marker of markers) {
                    marker.setVisible(zoom >= 9);
                }
            }
        });

        this.mounted = true;
    }
}
