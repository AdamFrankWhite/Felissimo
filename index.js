const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let sprite = new Image();
sprite.src = "./img/sprite/idle-right.png";

let fishPNG = new Image();
fishPNG.src = "./img/fish.png";
let catnipPNG = new Image();
catnipPNG.src = "./img/catnip.png";
let boarPNG = "./img/sprite/boar-sleep.png";
let catnipBarImg = new Image();
catnipBarImg.src = "./img/bar-blue.png";
let healthBarImg = new Image();
let barGreen = "./img/bar-green.png";
let barOrange = "./img/bar-orange.png";
let barRed = "./img/bar-red.png";
healthBarImg.src = barGreen;
const platformTexture = new Image();
platformTexture.src = "./img/platform.png";
let score = 0;
let catnipTimer = 0;
const gravity = 1;
let isJumping = false;
let isHighOnCatnip = false;
let isPlayerHurt = false;
let boarMovementTimer = 0;
let boarDirection;
let jumpStrength = 1;
let boarToRemove;

// set width and height to viewport dimensions

canvas.width = innerWidth;
canvas.height = innerHeight;
// const platformTexture = new Image('./')
const platformPositions = [
    { x: -50, y: 650, image: platformTexture },
    { x: 150, y: 650, image: platformTexture },
    { x: 350, y: 650, image: platformTexture },
    { x: 550, y: 650, image: platformTexture },
    { x: 750, y: 650, image: platformTexture },
    { x: 950, y: 650, image: platformTexture },
    { x: 1150, y: 650, image: platformTexture },
    { x: 1350, y: 650, image: platformTexture },
    { x: 1550, y: 650, image: platformTexture },
    { x: 1200, y: 500, image: platformTexture },
    { x: 1000, y: 300, image: platformTexture },
    { x: 700, y: 200, image: platformTexture },
    { x: 500, y: 200, image: platformTexture },
    { x: 300, y: 200, image: platformTexture },
    { x: 100, y: 200, image: platformTexture },
];
const fishPositions = [
    { x: 600, y: 150 },
    { x: 1100, y: 200 },
];

const catnipPositions = [
    { x: 0, y: 600 },
    { x: 700, y: 200 },
];

const setCatnipTimer = () => {
    isHighOnCatnip = true;
    catnipTimer = 5;
    catnipBar.width = 400;
    doTimer();
};

const doTimer = () => {
    setInterval(() => {
        if (catnipTimer > 0) {
            // divided all by 40 for smoother animation
            catnipTimer -= 1 / 40;
            catnipBar.width -= 2;
        } else isHighOnCatnip = false;
    }, 25);
};

class Player {
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
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
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
        } else {
            this.counter++;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            isJumping = false;
        }
        // if (!isFalling && !isJumping) {
        //     sprite.src = "./img/sprite/idle-right.png";
        // }
        this.draw();
    }
}

class Enemy {
    constructor(x, y, imageURL, id, moving) {
        this.id = id;
        this.position = {
            x,
            y,
        };
        this.width = 720;
        this.height = 512;
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
        this.boarMovementTimer;
        this.boarDirection;
    }

    setBoarMotion = () => {
        this.boarMovementTimer = 2;
        this.switchBoarMovement();
    };

    switchBoarMovement = () => {
        this.boarDirection = "right";
        setInterval(() => {
            // console.log(boarMovementTimer, boarDirection);
            if (this.boarMovementTimer > 0) {
                if (this.boarDirection == "left") {
                    this.boarDirection = "right";
                } else if (this.boarDirection == "right") {
                    this.boarDirection = "left";
                }
                this.boarMovementTimer--;
            } else {
                if (this.boarDirection == "left") {
                    this.boarDirection = "right";
                } else if (this.boarDirection == "right") {
                    this.boarDirection = "left";
                }
                this.boarMovementTimer = 2;
            }
        }, 2000);
    };
    draw() {
        ctx.drawImage(
            this.image,
            this.width * this.frames,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width / 5,
            this.height / 5
        );
    }

    update() {
        // slow down animation by 3
        if (this.counter == 3) {
            this.counter = 0;
            this.frames++;
            if (this.image.src.includes("boar-dead")) {
                this.velocity.x = 0;
                // once sprite complete, remove boar after slight delay
                setTimeout(() => {
                    enemies = enemies.filter((enemy) => {
                        console.log(enemy, boarToRemove);
                        return enemy.id != boarToRemove.id;
                    });
                    boarToRemove = "";
                }, 1000);

                // this.frames = 0;
            } else if (this.frames == 17) {
                this.frames = 0;
            }
        } else {
            this.counter++;
        }

        // check there is no boar to remove, to avoid issue with delay of settimeout for removing boar
        if (this.boarDirection == "left" && !boarToRemove) {
            this.image.src = "./img/sprite/boar-walk-left.png";
            this.velocity.x = -2.5;
        } else if (this.boarDirection == "right" && !boarToRemove) {
            this.image.src = "./img/sprite/boar-walk-right.png";
            this.velocity.x = 2.5;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        this.draw();
    }
}
// Health bar

class ProgressBar {
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

class Platform {
    constructor(x, y, image) {
        this.position = {
            x,
            y,
        };
        this.width = image.width;
        this.height = image.height * 1.5;
        this.image = image;
    }
    draw() {
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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

// Fish

class Item {
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
const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

let enemies = [
    new Enemy(300, 0, boarPNG, 1, false),
    new Enemy(800, 550, boarPNG, 2, false),
];
let healthBar = new ProgressBar(50, 50, 400, healthBarImg);
let catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

let player = new Player();
let platforms = platformPositions.map(
    (platform) => new Platform(platform.x, platform.y, platform.image)
);

let fishes = fishPositions.map(
    (item) => new Item(item.x, item.y, fishPNG, "fish")
);

let catnip = catnipPositions.map(
    (item) => new Item(item.x, item.y, catnipPNG, "catnip")
);

function init() {
    enemies = [
        new Enemy(500, 500, boarPNG, 1, false),
        new Enemy(800, 500, boarPNG, 2, false),
    ];
    healthBarImg.src = barGreen;
    healthBar = new ProgressBar(50, 50, 400, healthBarImg);
    catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

    player = new Player();
    platforms = platformPositions.map(
        (platform) => new Platform(platform.x, platform.y)
    );

    fishes = fishPositions.map(
        (item) => new Item(item.x, item.y, fishPNG, "fish")
    );

    catnip = catnipPositions.map(
        (item) => new Item(item.x, item.y, catnipPNG, "catnip")
    );
}

const getRectangleCollisions = () => {
    platforms.forEach((platform) => {
        // Added width offsets to cater to sprite's padding
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
                platform.position.y &&
            player.position.x + player.width - 60 >= platform.position.x &&
            player.position.x + 50 <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
            isJumping = false;
        }

        // enemies collision with platforms
        enemies.forEach((enemy) => {
            if (
                enemy.position.y + enemy.height <= platform.position.y &&
                enemy.position.y + enemy.height + 35 + enemy.velocity.y >=
                    platform.position.y &&
                enemy.position.x + enemy.width >= platform.position.x &&
                enemy.position.x <= platform.position.x + platform.width
            ) {
                enemy.velocity.y = 0;
            }
        });
    });

    enemies.forEach((enemy) => {
        // Added width offsets to cater to sprite's padding
        //jump on enemy
        if (
            player.position.y + player.height <= enemy.position.y &&
            player.position.y + player.height + player.velocity.y >=
                enemy.position.y &&
            player.position.x + player.width - 60 >= enemy.position.x &&
            player.position.x + 50 <= enemy.position.x + enemy.width / 5
        ) {
            // set counter frames to 0 to avoid glitchy sprite

            // only bounce on initial boar jump
            if (!enemy.image.src.includes("boar-dead")) {
                console.log("killed");
                player.velocity.y = -15;
                enemy.counter = 0;
                enemy.frames = 0;
                boarToRemove = enemy;
            }
            if (enemy.boarDirection == "left") {
                enemy.image.src = "./img/sprite/boar-dead-left.png";
            } else {
                enemy.image.src = "./img/sprite/boar-dead-right.png";
            }

            // boarToRemove = "";
        }

        // touch enemy
        else if (
            !boarToRemove &&
            player.position.y <= enemy.position.y &&
            player.position.y + player.height + player.velocity.y >=
                enemy.position.y &&
            player.position.x + player.width - 60 >= enemy.position.x &&
            player.position.x + 40 <= enemy.position.x + enemy.width / 5
        ) {
            // set counter frames to 0 to avoid glitchy sprite

            // only bounce on initial boar jump
            // if (!boarPNG.src.includes("boar-dead.png")) {

            enemy.counter = 0;
            enemy.frames = 0;
            // }
            enemy.setBoarMotion();
            isPlayerHurt = true;
            healthBar.width = healthBar.width - 50;
            console.log(healthBar.width);
            if (healthBar.width == 0) {
                // player.velocity.x = 0;
                // sprite.src = "./img/sprite/dead.png";
                let num = 1;
                setInterval(() => {
                    num -= 0.01;
                    canvas.style.filter = `brightness(${num})`;
                    console.log(canvas.style.filter);
                }, 20);
                setTimeout(() => {
                    init();
                    canvas.style.filter = "saturate(3.5)";
                }, 2000);
            } else if (healthBar.width <= 100) {
                healthBarImg.src = barRed;
            } else if (healthBar.width <= 250) {
                healthBarImg.src = barOrange;
            } else if (healthBar.width == 400) {
                healthBarImg.src = barGreen;
            }
            setTimeout(() => {
                isPlayerHurt = false;
                sprite.src = "./img/sprite/idle-right.png";
            }, 400);
        }
    });

    fishes.forEach((fish) => {
        // Added width offsets to cater to sprite's padding
        if (
            player.position.y <= fish.position.y &&
            player.position.y + player.height + player.velocity.y >=
                fish.position.y &&
            player.position.x + player.width - 60 >= fish.position.x &&
            player.position.x + 40 <= fish.position.x + fish.width / 4
        ) {
            fishes = fishes.filter(
                (currentFish) => fish.position.x != currentFish.position.x
            );
            score += 50;
            if (healthBar.width < 400) {
                healthBar.width += 50;
            }

            if (healthBar.width <= 100) {
                healthBarImg.src = barRed;
            } else if (healthBar.width <= 250) {
                healthBarImg.src = barOrange;
            } else if (healthBar.width > 250) {
                healthBarImg.src = barGreen;
            }
        }
    });

    catnip.forEach((leaf) => {
        // Added width offsets to cater to sprite's padding
        if (
            player.position.y <= leaf.position.y &&
            player.position.y + player.height + player.velocity.y >=
                leaf.position.y &&
            player.position.x + player.width - 60 >= leaf.position.x &&
            player.position.x + 40 <= leaf.position.x + leaf.width / 4
        ) {
            catnip = catnip.filter(
                (currentLeaf) => leaf.position.x != currentLeaf.position.x
            );
            setCatnipTimer();
        }
    });
};

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    healthBar.draw();
    catnipBar.draw();
    // draw platforms first layer
    platforms.forEach((platform) => platform.draw());
    fishes.forEach((fish) => fish.draw());
    catnip.forEach((leaf) => leaf.draw());
    enemies.forEach((enemy) => enemy.update());
    if (isPlayerHurt) {
        player.velocity.x = -5;
    } else if (keys.right.pressed && player.position.x < 750) {
        if (isHighOnCatnip) {
            player.velocity.x = 20;
        } else {
            player.velocity.x = 7;
        }
    } else if (keys.left.pressed && player.position.x > 450) {
        if (isHighOnCatnip) {
            player.velocity.x = -20;
        } else {
            player.velocity.x = -7;
        }
    } else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            platforms = platforms.map((platform) => {
                if (isHighOnCatnip) {
                    platform.position.x -= 10;
                } else {
                    platform.position.x -= 5;
                }

                return platform;
            });
            enemies = enemies.map((enemy) => {
                if (isHighOnCatnip) {
                    enemy.position.x -= 10;
                } else {
                    enemy.position.x -= 5;
                }

                return enemy;
            });
            fishes = fishes.map((fish) => {
                if (isHighOnCatnip) {
                    fish.position.x -= 10;
                } else {
                    fish.position.x -= 5;
                }

                return fish;
            });
            catnip = catnip.map((leaf) => {
                if (isHighOnCatnip) {
                    leaf.position.x -= 10;
                } else {
                    leaf.position.x -= 5;
                }
                return leaf;
            });
        } else if (keys.left.pressed) {
            platforms = platforms.map((platform) => {
                if (isHighOnCatnip) {
                    platform.position.x += 10;
                } else {
                    platform.position.x += 5;
                }
                return platform;
            });
            enemies = enemies.map((enemy) => {
                if (isHighOnCatnip) {
                    enemy.position.x += 10;
                } else {
                    enemy.position.x += 5;
                }

                return enemy;
            });
            fishes = fishes.map((fish) => {
                if (isHighOnCatnip) {
                    fish.position.x += 10;
                } else {
                    fish.position.x += 5;
                }
                return fish;
            });
            catnip = catnip.map((leaf) => {
                if (isHighOnCatnip) {
                    leaf.position.x += 10;
                } else {
                    leaf.position.x += 5;
                }
                return leaf;
            });
        }
    }

    player.update();
    getRectangleCollisions(platforms);
};

animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "a":
            sprite.src = "./img/sprite/walk-left.png";
            keys.left.pressed = true;

            break;
        case "s":
            if (keys.left.pressed) {
                sprite.src = "./img/sprite/slide-left.png";
            } else {
                sprite.src = "./img/sprite/slide-right.png";
            }

            break;
        case "d":
            sprite.src = "./img/sprite/walk-right.png";
            keys.right.pressed = true;

            break;
        case "w":
            // simply checking velocity y == 0 doesn't work as it can be greater due to gravity creating jumping bugginess
            // instead check state of jumping and check velocity is negligible as when landing it is sometimes 1/2/3
            // prevent double jumps

            if (!isJumping && player.velocity.y <= 5) {
                player.velocity.y -= 20;
            }
            isJumping = true;
            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = false;
            // ensure right key is depressed to avoid sprite bug when rapidly changing direction
            if (!keys.right.pressed) {
                sprite.src = "./img/sprite/idle-left.png";
            }
            break;
        case "s":
            if (keys.left.pressed) {
                sprite.src = "./img/sprite/walk-left.png";
            } else {
                sprite.src = "./img/sprite/walk-right.png";
            }
            break;
        case "d":
            keys.right.pressed = false;
            // ensure left key is depressed to avoid sprite bug when rapidly changing direction
            if (!keys.left.pressed) {
                sprite.src = "./img/sprite/idle-right.png";
            }
            break;
        case "w":
            break;
    }
});
