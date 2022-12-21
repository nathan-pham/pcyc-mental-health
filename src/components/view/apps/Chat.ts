import html, { $ } from "../../../engine/html";
import Page from "../../../engine/Page";

export default class Chat extends Page {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const chat = $(this.getPage(), ".chat");
        const input = $(this.getPage(), "input") as HTMLInputElement;

        chat.appendChild(
            html("div", { class: "chat__response chat__response-you" }, [
                input.value,
            ])
        );

        this.scrollToBottom();
        input.value = "";
    }

    scrollToBottom() {
        const chat = $(this.getPage(), ".chat");
        chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
    }

    onMount() {
        this.scrollToBottom();

        $(this.getPage(), "form").addEventListener(
            "submit",
            this.onSubmit as EventListener
        );
    }

    onUnmount() {
        $(this.getPage(), "form").removeEventListener(
            "submit",
            this.onSubmit as EventListener
        );
    }
}
