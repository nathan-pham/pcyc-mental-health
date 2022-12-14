import PageManager from "./engine/PageManager";
import Page from "./engine/Page";
import Chat from "./components/view/apps/Chat";

const pageManager = new PageManager("/");
pageManager.addPages({
    "/": new Page({ id: "#page-hero" }),
    "/chat": new Chat({ id: "#page-chat" }),
});

export default pageManager;
