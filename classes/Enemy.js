import { ctx } from "../ctx/ctx.js";
export class Enemy {
    constructor(x, y, imageURL, imgWidth, imgHeight, id, enemyType, moving) {
        this.id = id;
        this.position = {
            x,
            y,
        };
        this.width = imgWidth / 5;
        this.height = imgHeight / 5;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.frames = 0;
        this.counter = 0;
        //Need to create img instance tied to enemy instance
        this.image = new Image();
        this.image.src = imageURL;
        this.moving = moving;
        this.enemyMovementTimer;
        this.enemyDirection;
        this.enemyType = enemyType;
        this.setEnemyMotion();
    }

    setEnemyMotion = () => {
        this.enemyMovementTimer = 2;
        this.switchEnemyMovement();
    };

    switchEnemyMovement = () => {
        this.enemyDirection = "right";
        setInterval(() => {
            if (this.enemyMovementTimer > 0) {
                if (this.enemyDirection == "left") {
                    this.enemyDirection = "right";
                } else if (this.enemyDirection == "right") {
                    this.enemyDirection = "left";
                }
                this.enemyMovementTimer--;
                if (this.enemyType == "monkey") {
                    // this.velocity.y = -15;
                    // this.velocity.x = 10;
                }
            } else {
                if (this.enemyDirection == "left") {
                    this.enemyDirection = "right";
                } else if (this.enemyDirection == "right") {
                    this.enemyDirection = "left";
                }
                this.enemyMovementTimer = 2;
                if (this.enemyType == "monkey") {
                    // this.velocity.y = -15;
                    // this.velocity.x = 10;
                }
            }
        }, 2000);
    };
    draw() {
        ctx.drawImage(
            this.image,
            this.width * 5 * this.frames,
            0,
            this.width * 5,
            this.height * 5,
            this.position.x,
            this.position.y + 15,
            this.width,
            this.height
        );
    }

    update() {
        // slow down animation by 3
        if (this.counter == 2) {
            this.counter = 0;
            this.frames++;
            if (this.image.src.includes("dead")) {
                this.velocity.x = 0;
                // once sprite complete, remove boar after slight delay
                setTimeout(() => {
                    enemies = enemies.filter((enemy) => {
                        return enemy.id != enemyToRemove.id;
                    });
                    enemyToRemove = "";
                }, 1000);

                // this.frames = 0;
            } else if (
                this.enemyType == "monkey" &&
                !this.image.src.includes("monkey-dead") &&
                this.frames == 13
            ) {
                this.frames = 0;
            } else if (
                this.enemyType == "monkey" &&
                this.image.src.includes("monkey-jump") &&
                this.frames == 4
            ) {
                this.frames = 0;
            } else if (this.frames == 17) {
                this.frames = 0;
            }
        } else {
            this.counter++;
        }

        // check there is no boar to remove, to avoid issue with delay of settimeout for removing boar
        if (this.enemyDirection == "left" && !enemyToRemove) {
            this.image.src = `./img/sprite/${this.enemyType}-walk-left.png`;

            this.velocity.x = -2.5;
        } else if (this.enemyDirection == "right" && !enemyToRemove) {
            this.image.src = `./img/sprite/${this.enemyType}-walk-right.png`;

            this.velocity.x = 2.5;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.velocity.y += gravity;
        if (this.position.y + this.height > canvas.height - 50) {
            this.velocity.y = 0;
        }

        this.draw();
    }
}
