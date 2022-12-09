export default class ComponentView {
    private animationId = 0;

    update() {}

    core() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.update();
        };

        this.animationId = requestAnimationFrame(animate);
    }

    pause() {
        cancelAnimationFrame(this.animationId);
    }
}
