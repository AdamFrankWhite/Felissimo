import { ctx } from "../ctx/ctx.js";
export class Item {
    constructor(x, y, image, itemType) {
        this.position = {
            x,
            y,
        };
        this.width = image.width;
        this.height = image.height;
        this.image = image;
        this.itemType = itemType;
    }
    draw() {
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
            this.image,
            0,
            0,
            this.width * 4,
            this.height * 4,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}
