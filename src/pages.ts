import PageManager from "./engine/PageManager";
import Page from "./engine/Page";

const pageManager = new PageManager("/");
pageManager.addPages({
    "/": new Page({ id: "#page-hero" }),
    // TODO: implement page functionality
    "/chat": new Page({ id: "#page-chat" }),
    "/depression": new Page({ id: "#page-classification" }),
});

export default pageManager;
