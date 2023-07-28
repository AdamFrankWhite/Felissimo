import { ctx } from "../ctx/ctx.js";
export class Platform {
    constructor(x, y, image, type, speed) {
        this.scale =
            image.src.includes("/img/platform.png") ||
            image.src.includes("slope")
                ? 2
                : image.src.includes("/img/spike.png")
                ? 2.4
                : 1;
        // this.offsetY = image.src.includes("/img/spike.png") ? 50 : 0;
        this.position = {
            x,
            y,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = speed;
        this.width = image.width / this.scale;
        this.height = image.height / this.scale;
        this.image = image;
        this.platformType = type;
        this.platformMovementTimer;
        this.platformDirection;
        this.setPlatformMotion();
    }

    setPlatformMotion = () => {
        if (this.platformType == "moving") {
            this.platformMovementTimer = 5 / this.speed;
            this.switchPlatformMovement();
        }
    };

    switchPlatformMovement = () => {
        this.platformDirection = "right";
        setInterval(() => {
            if (this.platformMovementTimer > 0) {
                if (this.platformDirection == "left") {
                    this.platformDirection = "right";
                } else if (this.platformDirection == "right") {
                    this.platformDirection = "left";
                }
                this.platformMovementTimer--;
            } else {
                if (this.platformDirection == "left") {
                    this.platformDirection = "right";
                } else if (this.platformDirection == "right") {
                    this.platformDirection = "left";
                }
                this.platformMovementTimer = 5 / this.speed;
            }
        }, 5000 / this.speed);
    };

    draw() {
        if (this.platformDirection == "left" && this.platformType == "moving") {
            this.velocity.x = -2.5;
        } else if (
            this.platformDirection == "right" &&
            this.platformType == "moving"
        ) {
            this.velocity.x = 2.5;
        }
        if (this.platformType == "moving") {
            this.position.x += this.velocity.x * this.speed;
        }

        ctx.drawImage(
            this.image,
            0,
            0,
            this.width * this.scale,
            this.height * this.scale,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}
