const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let sprite = new Image();
sprite.src = "./img/sprite/idle-right.png";

let fishPNG = new Image();
fishPNG.src = "./img/fish.png";

const gravity = 1;
let isJumping = false;
let jumpStrength = 1;
class Player {
    constructor() {
        this.position = {
            x: 300,
            y: 100,
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
        if (this.counter == 3) {
            this.counter = 0;
            this.frames++;
            if (!sprite.src.includes("jump.png") && this.frames == 9) {
                this.frames = 0;
            }
            if (sprite.src.includes("jump.png") && this.frames == 7) {
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

const platformTexture = new Image();
platformTexture.src = "/img/stones-146304.svg";
class Platform {
    constructor(x, y) {
        this.position = {
            x,
            y,
        };
        this.width = 175;
        this.height = 20;
    }
    draw() {
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
            platformTexture,
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

// Fish

class Fish {
    constructor(x, y) {
        this.position = {
            x,
            y,
        };
        this.width = fishPNG.width;
        this.height = fishPNG.height;
    }
    draw() {
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
            fishPNG,
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

// set width and height to viewport dimensions

canvas.width = innerWidth;
canvas.height = innerHeight;
// const platformTexture = new Image('./')
const platformPositions = [
    { x: 300, y: 500 },
    { x: 700, y: 550 },
    { x: 600, y: 350 },
    { x: 800, y: 300 },
    { x: 1000, y: 200 },
    { x: 1200, y: 300 },
    { x: 1500, y: 200 },
    { x: 1700, y: 300 },
    { x: 1900, y: 200 },
    { x: 2150, y: 300 },
    { x: 2400, y: 200 },
];

const player = new Player();
let platforms = platformPositions.map(
    (platform) => new Platform(platform.x, platform.y)
);

const fishPositions = [
    { x: 0, y: 600 },
    { x: 700, y: 600 },
    { x: 600, y: 250 },
    { x: 800, y: 500 },
    { x: 1000, y: 300 },
    { x: 1200, y: 400 },
];

let fishes = fishPositions.map((fish) => new Fish(fish.x, fish.y));

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
        }
    });
};
const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw platforms first layer
    platforms.forEach((platform) => platform.draw());
    fishes.forEach((fish) => fish.draw());
    if (keys.right.pressed && player.position.x < 750) {
        player.velocity.x = 7;
    } else if (keys.left.pressed && player.position.x > 450) {
        player.velocity.x = -7;
    } else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            platforms = platforms.map((platform) => {
                platform.position.x -= 5;
                return platform;
            });
            fishes = fishes.map((fish) => {
                fish.position.x -= 5;
                return fish;
            });
        } else if (keys.left.pressed) {
            platforms = platforms.map((platform) => {
                platform.position.x += 5;
                return platform;
            });
            fishes = fishes.map((fish) => {
                fish.position.x += 5;
                return fish;
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
            keys.left.pressed = true;
            sprite.src = "./img/sprite/walk-left.png";
            break;
        case "s":
            if (keys.left.pressed) {
                sprite.src = "./img/sprite/slide-left.png";
            } else {
                sprite.src = "./img/sprite/slide-right.png";
            }

            break;
        case "d":
            console.log(player.velocity.y);
            keys.right.pressed = true;
            sprite.src = "./img/sprite/walk-right.png";
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
            sprite.src = "./img/sprite/idle-left.png";
            break;
        case "s":
        case "s":
            if (keys.left.pressed) {
                sprite.src = "./img/sprite/walk-left.png";
            } else {
                sprite.src = "./img/sprite/walk-right.png";
            }
            break;
        case "d":
            keys.right.pressed = false;
            sprite.src = "./img/sprite/idle-right.png";
            break;
        case "w":
            break;
    }
});
