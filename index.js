const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gravity = 1;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        };
        this.width = 30;
        this.height = 30;
        this.velocity = {
            x: 0,
            y: 0,
        };
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
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

class Platform {
    constructor(x, y) {
        this.position = {
            x,
            y,
        };
        this.width = 200;
        this.height = 20;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
// set width and height to viewport dimensions

canvas.width = innerWidth;
canvas.height = innerHeight;

const platformPositions = [
    { x: 300, y: 500 },
    { x: 700, y: 550 },
    { x: 600, y: 350 },
    { x: 800, y: 300 },
    { x: 1000, y: 200 },
];

const player = new Player();
const platforms = platformPositions.map(
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
    if (keys.right.pressed) {
        player.velocity.x = 7;
    } else if (keys.left.pressed) {
        player.velocity.x = -7;
    } else {
        player.velocity.x = 0;
    }

    getRectangleCollisions(platforms);
};

animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = true;
            break;
        case "s":
            console.log("down");
            break;
        case "d":
            keys.right.pressed = true;
            break;
        case "w":
            console.log("up");
            player.velocity.y -= 1;
            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = false;
            break;
        case "s":
            console.log("down");
            break;
        case "d":
            keys.right.pressed = false;
            break;
        case "w":
            console.log("up");
            player.velocity.y -= 20;
            break;
    }
});
