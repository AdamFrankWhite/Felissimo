import { ctx } from "../ctx/ctx.js";
import { sprite } from "../textures/sprites.js";

export class Player {
    constructor() {
        this.position = {
            x: 300,
            y: 300,
        };
        this.width = 136;
        this.height = sprite.height / 4;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.frames = 0;
        this.counter = 0;

        this.offsetY = 10;
    }
    draw() {
        ctx.drawImage(
            sprite,
            !sprite.src.includes("jump.png")
                ? (sprite.width / 10) * this.frames
                : (sprite.width / 8) * this.frames,
            0,
            !sprite.src.includes("jump.png")
                ? sprite.width / 10
                : sprite.width / 8,
            sprite.height,
            this.position.x,
            this.position.y + this.offsetY,
            this.width,
            this.height
        );
    }

    update() {
        // die if fall off screen
        if (player.position.y > canvas.height) {
            // restartLevel();
        }
        if (isPlayerHurt) sprite.src = "./img/sprite/hurt.png";
        // slow down animation by 3
        if (this.counter == 3) {
            this.counter = 0;
            this.frames++;
            if (!sprite.src.includes("jump.png") && this.frames == 9) {
                this.frames = 0;
            }
            if (sprite.src.includes("hurt.png") && this.frames == 6) {
                this.frames = 0;
            }
        } else if (isPlayerDead) {
            this.offsetY = 30;
            this.counter = 0;
        } else {
            this.counter++;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        // if (this.position.y + this.height + this.velocity.y < canvas.height) {

        this.velocity.y += gravity;
        if (this.position.y + this.height > canvas.height - 50) {
            this.velocity.y = 0;
        }
        // }
        // else {
        //     this.velocity.y = 0;
        //     isJumping = false;
        // }

        this.draw();
    }
}
