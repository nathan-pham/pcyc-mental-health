import PageManager from "./engine/PageManager";
import Page from "./engine/Page";
import Chat from "./components/view/apps/Chat";

const pageManager = new PageManager("/");
pageManager.addPages({
    "/": new Page({ id: "#page-hero" }),
    // TODO: implement page functionality
    "/chat": new Chat({ id: "#page-chat" }),
    "/depression": new Page({ id: "#page-classification" }),
});

export default pageManager;
