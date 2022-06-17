const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Preload images to avoid blank frames when initially loading sprite for changing direction, etc
var images = [];
function preload(imageData) {
    imageData.forEach((imgPath) => {
        let x = new Image();
        x.src = imgPath;
        images.push(x);
    });
}

//-- usage --//
preload([
    "img/sprite/boar-dead-left.png",
    "img/sprite/boar-dead-right.png",
    "img/sprite/boar-jump-right.png",
    "img/sprite/boar-sleep.png",
    "img/sprite/boar-walk-left.png",
    "img/sprite/boar-walk-right.png",
    "img/sprite/dead.png",
    "img/sprite/fall.png",
    "img/sprite/hurt.png",
    "img/sprite/idle-left.png",
    "img/sprite/idle-right.png",
    "img/sprite/jump.png",
    "img/sprite/monkey-dead-left.png",
    "img/sprite/monkey-dead-right.png",
    "img/sprite/monkey-idle.png",
    "img/sprite/monkey-walk-left.png",
    "img/sprite/monkey-walk-right.png",
    "img/sprite/monkey-jump-left.png",
    "img/sprite/monkey-jump-right.png",
    "img/sprite/run.png",
    "img/sprite/slide-left.png",
    "img/sprite/slide-right.png",
    "img/sprite/walk-left.png",
    "img/sprite/walk-right.png",
]);
let sprite = new Image();
sprite.src = "./img/sprite/idle-right.png";

let fishPNG = new Image();
fishPNG.src = "./img/fish.png";
let catnipPNG = new Image();
catnipPNG.src = "./img/catnip.png";
let boarPNG = "./img/sprite/boar-sleep.png";
let monkeyPNG = "./img/sprite/monkey-idle.png";
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
let enemyMovementTimer = 0;
let enemyDirection;
let jumpStrength = 1;
let enemyToRemove;
let playerDirection = "";
// set width and height to viewport dimensions

canvas.width = 1500;
canvas.height = 800;
let lickSound = new Audio("./sound/cat-lick.mp3");
lickSound.playbackRate = 2;
let hurtSound = new Audio("./sound/cat-hurt.wav");
hurtSound.playbackRate = 2;
let platformPositions = [
    { x: -50, y: 650, image: platformTexture, type: "left" },
    { x: 150, y: 650, image: platformTexture, type: "main" },
    { x: 350, y: 650, image: platformTexture, type: "main" },
    { x: 550, y: 650, image: platformTexture, type: "main" },
    { x: 750, y: 650, image: platformTexture, type: "main" },
    { x: 950, y: 650, image: platformTexture, type: "right" },
    { x: 1150, y: 650, image: platformTexture, type: "left" },
    { x: 1350, y: 650, image: platformTexture, type: "main" },
    { x: 1550, y: 650, image: platformTexture, type: "right" },
    { x: 1200, y: 510, image: platformTexture, type: "single" },
    { x: 1000, y: 300, image: platformTexture, type: "single" },
    { x: 700, y: 200, image: platformTexture, type: "left" },
    { x: 500, y: 200, image: platformTexture, type: "main" },
    { x: 300, y: 200, image: platformTexture, type: "main" },
    { x: 100, y: 200, image: platformTexture, type: "right" },
    { x: 900, y: 0, image: platformTexture, type: "single" },
    { x: 800, y: -100, image: platformTexture, type: "left" },
    { x: 1000, y: -100, image: platformTexture, type: "main" },
    { x: 1200, y: -100, image: platformTexture, type: "main" },
    { x: 1400, y: -100, image: platformTexture, type: "right" },
    { x: 1100, y: -300, image: platformTexture, type: "single" },
    { x: 1200, y: -400, image: platformTexture, type: "left" },
    { x: 1400, y: -400, image: platformTexture, type: "right" },
];
let fishPositions = [
    { x: 600, y: 100 },
    { x: 1100, y: 200 },
];

let catnipPositions = [{ x: 0, y: 575 }];

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
            this.position.y + 10,
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

class Enemy {
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
    constructor(x, y, image, type) {
        this.position = {
            x,
            y,
        };
        this.width = image.width;
        this.height = image.height * 1.5;
        this.image = image;
        this.type = type;
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
    new Enemy(300, 0, boarPNG, 720, 512, 1, "boar", false),
    new Enemy(800, 530, monkeyPNG, 640, 600, 3, "monkey", false),
    // new Enemy(800, 0, boarPNG, 720, 512, 2, "boar", false),
    // new Enemy(800, -350, monkeyPNG, 640, 600, 3, "monkey", false),
];
let healthBar = new ProgressBar(50, 50, 400, healthBarImg);
let catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

let player = new Player();
let platforms = platformPositions.map(
    (platform) =>
        new Platform(platform.x, platform.y, platform.image, platform.type)
);

let fishes = fishPositions.map(
    (item) => new Item(item.x, item.y, fishPNG, "fish")
);

let catnip = catnipPositions.map(
    (item) => new Item(item.x, item.y, catnipPNG, "catnip")
);

function restartLevel() {
    let num = 1;
    setInterval(() => {
        num -= 0.01;
        canvas.style.filter = `brightness(${num})`;
    }, 20);
    setTimeout(() => {
        canvas.style.filter = "saturate(3.5)";
        init();
    }, 2000);
}

function init() {
    enemies = [
        new Enemy(300, 0, boarPNG, 720, 512, 1, "boar", false),
        new Enemy(1000, 550, boarPNG, 720, 512, 2, "boar", false),
        new Enemy(700, 535, monkeyPNG, 640, 600, 3, "monkey", false),
    ];
    healthBarImg.src = barGreen;
    healthBar = new ProgressBar(50, 50, 400, healthBarImg);
    catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

    player = new Player();
    platforms = platformPositions.map(
        (platform) => new Platform(platform.x, platform.y, platform.image)
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
                enemy.position.y + enemy.height + enemy.velocity.y >=
                    platform.position.y &&
                enemy.position.x + enemy.width - 50 >= platform.position.x &&
                enemy.position.x + 50 <= platform.position.x + platform.width
            ) {
                enemy.velocity.y = 0;
            }

            // prevent enemies falling left
            if (
                enemy.position.x + enemy.width < platform.position.x &&
                platform.type == "left"
            ) {
                console.log("computer left");
                // enemy.switchEnemyMovement();
            }
            // if (enemy.velocity.y > 0) {
            //     setEnemyMotion();
            // }
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
            player.position.x + 50 <= enemy.position.x + enemy.width
        ) {
            // set counter frames to 0 to avoid glitchy sprite

            // only bounce on initial boar jump
            if (!enemy.image.src.includes(`${enemy.enemyType}-dead`)) {
                player.velocity.y = -15;
                enemy.counter = 0;
                enemy.frames = 0;
                enemyToRemove = enemy;
            }
            if (enemy.enemyDirection == "left") {
                enemy.image.src = `./img/sprite/${enemy.enemyType}-dead-left.png`;
            } else {
                enemy.image.src = `./img/sprite/${enemy.enemyType}-dead-right.png`;
            }

            // enemyToRemove = "";
        }

        // touch enemy
        else if (
            !enemyToRemove &&
            player.position.y - 50 <= enemy.position.y &&
            player.position.y + player.height + player.velocity.y >=
                enemy.position.y &&
            player.position.x + player.width - 60 >= enemy.position.x &&
            player.position.x + 40 <= enemy.position.x + enemy.width &&
            !sprite.src.includes("hurt.png")
        ) {
            hurtSound.play();
            // set counter frames to 0 to avoid glitchy sprite

            // only bounce on initial boar jump
            // if (!boarPNG.src.includes("boar-dead.png")) {

            enemy.counter = 0;
            enemy.frames = 0;
            // }
            enemy.setEnemyMotion();
            isPlayerHurt = true;

            healthBar.width = healthBar.width - 50;
            if (healthBar.width == 0) {
                // player.velocity.x = 0;
                // sprite.src = "./img/sprite/dead.png";
                restartLevel();
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
            lickSound.play();
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

    catnipBar.draw();
    // draw platforms first layer
    platforms.forEach((platform) => platform.draw());
    fishes.forEach((fish) => fish.draw());
    catnip.forEach((leaf) => leaf.draw());
    enemies.forEach((enemy) => enemy.update());
    if (player.position.y < 200) {
        player.position.y += 4;
        platforms = platforms.map((platform) => {
            platform.position.y += 4;

            return platform;
        });
        enemies = enemies.map((enemy) => {
            enemy.position.y += 4;

            return enemy;
        });
        fishes = fishes.map((fish) => {
            fish.position.y += 4;

            return fish;
        });
        catnip = catnip.map((leaf) => {
            leaf.position.y += 4;

            return leaf;
        });
    } else if (
        player.position.y > canvas.height - 225 &&
        player.position.y - player.height < canvas.height
    ) {
        // must minus player y pos too else won't collide with surfaces and falls through everything
        player.position.y -= 12;
        platforms = platforms.map((platform) => {
            platform.position.y -= 12;

            return platform;
        });
        enemies = enemies.map((enemy) => {
            enemy.position.y -= 12;

            return enemy;
        });
        fishes = fishes.map((fish) => {
            fish.position.y -= 12;

            return fish;
        });
        catnip = catnip.map((leaf) => {
            leaf.position.y -= 12;

            return leaf;
        });
    }

    if (isPlayerHurt) {
        // ensure player moves the correct direction
        player.velocity.x = playerDirection == "left" ? 5 : -5;
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
    healthBar.draw();
    player.update();
    getRectangleCollisions(platforms);
};

animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "a":
            sprite.src = "./img/sprite/walk-left.png";
            keys.left.pressed = true;
            playerDirection = "left";
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
            playerDirection = "right";
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
