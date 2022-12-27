import PageManager from "./engine/PageManager";
import Page from "./engine/Page";
import Chat from "./components/view/apps/Chat";
import Maps from "./components/view/apps/Maps";

const pageManager = new PageManager("/");
pageManager.addPages({
    "/": new Page({ id: "#page-hero" }),
    // TODO: implement page functionality
    "/chat": new Chat({ id: "#page-chat" }),
    "/depression": new Page({ id: "#page-classification" }),
    "/map": new Maps({ id: "#page-map" }),
});

export default pageManager;
