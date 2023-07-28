import { ctx } from "../ctx/ctx.js";
export class ProgressBar {
    constructor(x, y, initWidth, image) {
        this.position = {
            x,
            y,
        };
        this.width = initWidth;
        this.height = 50;
        this.image = image;
    }
    draw() {
        ctx.drawImage(
            this.image,
            0,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}
