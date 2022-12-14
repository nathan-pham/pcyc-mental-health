import Page from "./Page";

export default class PageManager {
    pages: Record<string, Page> = {};
    currentRoute: string;

    constructor(defaultCurrentRoute: string) {
        this.currentRoute = defaultCurrentRoute;
    }

    addPages(pages: Record<string, Page>) {
        for (const [route, page] of Object.entries(pages)) {
            this.pages[route] = page;
        }

        return this;
    }

    async navigateTo(route: string, forceRefresh = false) {
        if (!this.pages.hasOwnProperty(route)) {
            throw new Error(`Page not found ${route}`);
        }

        // already at this route, don't reanimate
        if (this.currentRoute === route && !forceRefresh) {
            return;
        }

        const prevPage = this.pages[this.currentRoute];
        await prevPage._onUnmount();
        prevPage.onUnmount();

        const page = this.pages[route];
        page.onMount();
        await page._onMount();

        this.currentRoute = route;
    }
}
