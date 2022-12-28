import PageManager from "./engine/PageManager";
import Page from "./engine/Page";
import Chat from "./components/view/apps/Chat";
import Maps from "./components/view/apps/Maps";

const pageManager = new PageManager("/");
pageManager.addPages([
    new Page({ id: "#page-hero", route: "/" }),
    new Chat({ id: "#page-chat", route: "/chat" }),
    new Page({ id: "#page-classification", route: "/depression" }),
    new Maps({ id: "#page-map", route: "/map" }),
    new Page({ id: "#page-breathing", route: "/breathe" }),
]);

export default pageManager;
