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
    "img/platform.png",
    "img/platform-moving.png",
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
const movingPlatformTexture = new Image();
movingPlatformTexture.src = "./img/platform-moving.png";
const spikeImg = new Image();
spikeImg.src = "./img/spike.png";
const lifePNG = new Image();
lifePNG.src = "./img/life-icon.png";
const platformSlopeRight = new Image();
platformSlopeRight.src = "./img/platform-slope-right.png";
let score = 0;
let catnipTimer = 0;
const gravity = 1;
let isJumping = false;
let isHighOnCatnip = false;
let isPlayerOnMovingPlatform = false;
let isPlayerHurt = false;
let isPlayerDead = false;
let enemyMovementTimer = 0;
let enemyDirection;
let jumpStrength = 1;
let enemyToRemove;
let playerDirection = "";
// set width and height to viewport dimensions
let playerLives = 5;
canvas.width = 1500;
canvas.height = 800;
let lickSound = new Audio("./sound/cat-lick.mp3");
lickSound.playbackRate = 2;
let hurtSound = new Audio("./sound/cat-hurt.wav");
hurtSound.playbackRate = 2;
let spikeSound = new Audio("./sound/spike-trap.flac");
spikeSound.playbackRate = 2;
let backgroundMusic = new Audio("./sound/theme.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;

let platformPositions = [
    { x: -50, y: 700, image: platformTexture, type: "left" },
    // { x: 250, y: 550, image: platformSlopeRight, type: "sloping-right" },
    { x: 869, y: 752, image: spikeImg, type: "spike" },
    { x: 899, y: 752, image: spikeImg, type: "spike" },
    { x: 929, y: 752, image: spikeImg, type: "spike" },
    { x: 959, y: 752, image: spikeImg, type: "spike" },
    { x: 989, y: 752, image: spikeImg, type: "spike" },
    { x: 1019, y: 752, image: spikeImg, type: "spike" },
    { x: 1049, y: 752, image: spikeImg, type: "spike" },
    // { x: 350, y: 700, image: platformTexture, type: "main" },
    // { x: 750, y: 700, image: platformTexture, type: "main" },
    // { x: 1550, y: 700, image: platformTexture, type: "main" },
    // { x: 1550, y: 700, image: platformTexture, type: "main" },
    // { x: 950, y: 700, image: platformTexture, type: "right" },
    // { x: 1150, y: 700, image: platformTexture, type: "left" },
    { x: 1070, y: 700, image: platformTexture, type: "main" },
    { x: 1550, y: 700, image: movingPlatformTexture, type: "main" },
    { x: 1750, y: 700, image: movingPlatformTexture, type: "main" },
    { x: 1950, y: 700, image: movingPlatformTexture, type: "main" },
    { x: 2200, y: 750, image: spikeImg, type: "spike" },
    { x: 2230, y: 750, image: spikeImg, type: "spike" },
    { x: 2260, y: 750, image: spikeImg, type: "spike" },
    { x: 2290, y: 750, image: spikeImg, type: "spike" },
    { x: 2320, y: 750, image: spikeImg, type: "spike" },
    { x: 2350, y: 750, image: spikeImg, type: "spike" },
    { x: 2380, y: 750, image: spikeImg, type: "spike" },
    { x: 2410, y: 750, image: spikeImg, type: "spike" },
    { x: 2440, y: 750, image: spikeImg, type: "spike" },
    { x: 2470, y: 750, image: spikeImg, type: "spike" },
    { x: 2500, y: 750, image: spikeImg, type: "spike" },
    { x: 2530, y: 750, image: spikeImg, type: "spike" },
    { x: 2560, y: 750, image: spikeImg, type: "spike" },
    { x: 2590, y: 750, image: spikeImg, type: "spike" },
    { x: 2620, y: 750, image: spikeImg, type: "spike" },
    { x: 2650, y: 750, image: spikeImg, type: "spike" },
    { x: 2680, y: 750, image: spikeImg, type: "spike" },
    { x: 2710, y: 750, image: spikeImg, type: "spike" },
    { x: 2740, y: 750, image: spikeImg, type: "spike" },
    { x: 2770, y: 750, image: spikeImg, type: "spike" },
    { x: 2800, y: 750, image: spikeImg, type: "spike" },
    { x: 2830, y: 750, image: spikeImg, type: "spike" },
    { x: 2860, y: 750, image: spikeImg, type: "spike" },
    { x: 2890, y: 750, image: spikeImg, type: "spike" },
    { x: 2920, y: 750, image: spikeImg, type: "spike" },
    { x: 2950, y: 750, image: spikeImg, type: "spike" },
    { x: 2980, y: 750, image: spikeImg, type: "spike" },
    { x: 3010, y: 750, image: spikeImg, type: "spike" },
    { x: 3030, y: 750, image: spikeImg, type: "spike" },
    { x: 3060, y: 750, image: spikeImg, type: "spike" },
    { x: 3090, y: 750, image: spikeImg, type: "spike" },
    { x: 3120, y: 750, image: spikeImg, type: "spike" },
    { x: 3150, y: 750, image: spikeImg, type: "spike" },
    { x: 3180, y: 750, image: spikeImg, type: "spike" },
    { x: 3210, y: 750, image: spikeImg, type: "spike" },
    { x: 1800, y: 510, image: movingPlatformTexture, type: "single" },
    { x: 1600, y: 330, image: movingPlatformTexture, type: "single" },
    { x: 700, y: 200, image: platformTexture, type: "left" },
    { x: 500, y: 200, image: platformTexture, type: "main" },
    { x: 300, y: 200, image: platformTexture, type: "main" },
    { x: 350, y: 75, image: movingPlatformTexture, type: "right" },
    { x: 600, y: 0, image: movingPlatformTexture, type: "single" },
    { x: 800, y: -100, image: platformTexture, type: "left" },
    { x: 1000, y: -100, image: platformTexture, type: "main" },
    // { x: 1200, y: -100, image: platformTexture, type: "main" },
    // { x: 1400, y: -100, image: platformTexture, type: "main" },
    {
        x: 2200,
        y: -100,
        image: movingPlatformTexture,
        type: "moving",
        speed: 1.5,
    },
    {
        x: 3000,
        y: -100,
        image: movingPlatformTexture,
        type: "moving",
        speed: 2,
    },
    { x: 1100, y: -200, image: platformSlopeRight, type: "sloping-right" },
];
let fishPositions = [
    { x: 600, y: 100 },
    { x: 1100, y: 200 },
];

let catnipPositions = [{ x: 0, y: 575 }];
let livesPositions = [{ x: 200, y: 575 }];

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
    new Enemy(1200, 530, monkeyPNG, 640, 600, 3, "monkey", false),
    new Enemy(1000, -300, boarPNG, 720, 512, 2, "boar", false),
    // new Enemy(800, -350, monkeyPNG, 640, 600, 3, "monkey", false),
];
let healthBar = new ProgressBar(50, 50, 400, healthBarImg);
let catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);
let player = new Player();
let platforms = platformPositions.map(
    (platform) =>
        new Platform(
            platform.x,
            platform.y,
            platform.image,
            platform.type,
            platform.speed
        )
);

let fishes = fishPositions.map(
    (item) => new Item(item.x, item.y, fishPNG, "fish")
);

let catnip = catnipPositions.map(
    (item) => new Item(item.x, item.y, catnipPNG, "catnip")
);
let lives = livesPositions.map(
    (item) => new Item(item.x, item.y, lifePNG, "life")
);

function playerDies() {
    spikeSound.play();
    isPlayerDead = true;
    playerLives -= 1;
    sprite.src = "./img/sprite/dead.png";
    player.velocity.x = 0;
    player.velocity.y = 0;
    setTimeout(() => {
        restartLevel();
    }, 2000);
}

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
    isPlayerDead = false;
    sprite.src = "./img/sprite/idle-right.png";
    enemies = [
        new Enemy(300, 0, boarPNG, 720, 512, 1, "boar", false),
        new Enemy(1200, 530, monkeyPNG, 640, 600, 3, "monkey", false),
        new Enemy(1000, -300, boarPNG, 720, 512, 2, "boar", false),
        // new Enemy(800, -350, monkeyPNG, 640, 600, 3, "monkey", false),
    ];
    healthBarImg.src = barGreen;
    healthBar = new ProgressBar(50, 50, 400, healthBarImg);
    catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

    player = new Player();
    platforms = platformPositions.map(
        (platform) =>
            new Platform(platform.x, platform.y, platform.image, platform.type)
    );

    fishes = fishPositions.map(
        (item) => new Item(item.x, item.y, fishPNG, "fish")
    );

    catnip = catnipPositions.map(
        (item) => new Item(item.x, item.y, catnipPNG, "catnip")
    );
    // lives = livesPositions.map(
    //     (item) => new Item(item.x, item.y, lifePNG, "life")
    // );
}
const getRectangleCollisions = () => {
    platforms.forEach((platform) => {
        const isPlayerColliding =
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
                platform.position.y &&
            player.position.x + player.width - 60 >= platform.position.x &&
            player.position.x + 50 <= platform.position.x + platform.width;
        // Added width offsets to cater to sprite's padding
        if (isPlayerColliding) {
            player.velocity.y = 0;
            isJumping = false;
        }
        // move player along with moving platform
        if (isPlayerColliding && platform.platformType == "moving") {
            isPlayerOnMovingPlatform = true;
            if (platform.platformDirection == "left") {
                player.position.x -= 2.5 * platform.speed;
            } else {
                player.position.x += 2.5 * platform.speed;
            }
        } else {
            // isPlayerOnMovingPlatform = false
        }
        // check if playerdead to ensure only plays once
        if (
            isPlayerColliding &&
            !isPlayerDead &&
            platform.platformType == "spike"
        ) {
            console.log("spike");
            healthBar.width = 0;
            playerDies();
            isPlayerDead = true;
            keys.left.pressed = false;
            keys.right.pressed = false;
        }

        // moving down slopes
        // if (platform.platformType == "sloping-right") {
        //     let slope = ctx;
        //     slope.beginPath();
        //     slope.moveTo(platform.position.x, platform.position.y);
        //     slope.lineTo(
        //         platform.position.x + platform.width,
        //         platform.position.y + 125
        //     );
        //     slope.stroke();
        //     console.log(slope);
        // }
        // if (
        //     isPlayerColliding &&
        //     !isPlayerDead &&
        //     platform.platformType == "sloping-right"
        // ) {
        //     let offsetY =
        //         platform.position.x + platform.width - player.position.x;
        //     console.log("slope-right");
        //     if (keys.right.pressed) {
        //         player.offsetY += 2.5;
        //     } else if (keys.left.pressed) {
        //         player.offsetY -= 2.5;
        //     }
        // } else if (
        //     isPlayerColliding &&
        //     !isPlayerDead &&
        //     platform.platformType != "sloping-right"
        // ) {
        //     // reset offset

        //     player.offsetY = 10;
        // }

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

        // touch enemy - minus 50 off y pos to compensate for shorter enemies
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

                playerDies();
                isPlayerHurt = false;
                isPlayerDead = true;
                keys.left.pressed = false;
                keys.right.pressed = false;
            } else if (healthBar.width <= 100) {
                healthBarImg.src = barRed;
            } else if (healthBar.width <= 250) {
                healthBarImg.src = barOrange;
            } else if (healthBar.width == 400) {
                healthBarImg.src = barGreen;
            }
            if (!isPlayerDead) {
                setTimeout(() => {
                    isPlayerHurt = false;
                    sprite.src = "./img/sprite/idle-right.png";
                }, 400);
            }
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

    lives.forEach((life) => {
        // Added width offsets to cater to sprite's padding
        if (
            player.position.y <= life.position.y &&
            player.position.y + player.height + player.velocity.y >=
                life.position.y &&
            player.position.x + player.width - 60 >= life.position.x &&
            player.position.x + 40 <= life.position.x + life.width / 4
        ) {
            lives = lives.filter(
                (currentLife) => life.position.x != currentLife.position.x
            );
            playerLives += 1;
        }
    });
};

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catnipBar.draw();
    // draw platforms first layer
    platforms.forEach((platform) => platform.draw());

    getRectangleCollisions(platforms);
    fishes.forEach((fish) => fish.draw());
    catnip.forEach((leaf) => leaf.draw());
    enemies.forEach((enemy) => enemy.update());
    lives.forEach((life) => life.draw());
    ctx.drawImage(
        lifePNG,
        canvas.width - 90,
        30,
        lifePNG.width / 2.5,
        lifePNG.height / 2.5
    );
    ctx.font = "80px Pacifico";
    ctx.fillStyle = "white";
    ctx.fillText(`${playerLives}`, canvas.width - 135, 85);
    // playerLivesIcon.draw();
    // scroll screen y
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
        lives = lives.map((life) => {
            life.position.y += 4;

            return life;
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
        lives = lives.map((life) => {
            life.position.y -= 12;

            return life;
        });
    }

    if (isPlayerHurt) {
        // ensure player moves the correct direction
        player.velocity.x = playerDirection == "left" ? 5 : -5;

        // scroll screen
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
            lives = lives.map((life) => {
                if (isHighOnCatnip) {
                    life.position.x -= 10;
                } else {
                    life.position.x -= 5;
                }
                return life;
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
            lives = lives.map((life) => {
                if (isHighOnCatnip) {
                    life.position.x += 10;
                } else {
                    life.position.x += 5;
                }
                return life;
            });
        }
    }
    healthBar.draw();

    player.update();
};

animate();

addEventListener("keydown", ({ key }) => {
    backgroundMusic.play();
    if (!isPlayerDead)
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
    if (!isPlayerDead)
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
