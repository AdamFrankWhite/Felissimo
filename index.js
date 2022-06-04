const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let sprite = new Image();
sprite.src = "./img/sprite/idle-right.png";
const gravity = 1;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        };
        this.width = sprite.width / 40;
        this.height = sprite.height / 4;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.frames = 0;
        this.counter = 0;
    }
    draw() {
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        // ctx.scale(-1, 1);
        if (keys.left.pressed) {
        }
        ctx.drawImage(
            sprite,
            sprite.src != "./img/sprite/jump.png"
                ? (sprite.width / 10) * this.frames
                : (sprite.width / 8) * this.frames,
            0,
            sprite.width / 10,
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
            if (this.frames == 9) {
                this.frames = 0;
            }
        } else {
            this.counter++;
        }

        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
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
console.log(platforms);
const getRectangleCollisions = () => {
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
                platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
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
    player.update();
    platforms.forEach((platform) => platform.draw());
    if (keys.right.pressed && player.position.x < 750) {
        player.velocity.x = 7;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -7;
    } else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            platforms = platforms.map((platform) => {
                platform.position.x -= 5;
                return platform;
            });
        } else if (keys.left.pressed) {
            platforms = platforms.map((platform) => {
                platform.position.x += 5;
                return platform;
            });
        }
    }

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
            console.log("down");
            break;
        case "d":
            keys.right.pressed = true;
            sprite.src = "./img/sprite/walk-right.png";
            break;
        case "w":
            console.log("up");
            // prevent double jumps
            if (player.velocity.y == 0) {
                player.velocity.y -= 20;
                // sprite.src = "./img/sprite/jump.png";
            }
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
            console.log("down");
            break;
        case "d":
            keys.right.pressed = false;
            sprite.src = "./img/sprite/idle-right.png";
            break;
        case "w":
            console.log("up");
            // player.velocity.y -= 20;
            break;
    }
});
