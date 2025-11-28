export class GameLoop {

    private static requestId: number | null = null;

    static start(update: () => void) {
        if (this.requestId !== null) return;

        const loop = () => {
            update();
            this.requestId = requestAnimationFrame(loop);
        };

        this.requestId = requestAnimationFrame(loop);
    }

    static stop() {
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

}
