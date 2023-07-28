import { Enemy } from "./classes/Enemy.js";
import { Player } from "./classes/Player.js";
import { ProgressBar } from "./classes/ProgressBar.js";
import { Platform } from "./classes/Platform.js";
import { Item } from "./classes/Item.js";
import { platformPositions } from "./positions/level1.js";
import { fishPositions } from "./positions/level1.js";
import { catnipPositions } from "./positions/level1.js";
import { livesPositions } from "./positions/level1.js";
import { enemies } from "./positions/level1.js";
import { sprite } from "./textures/sprites.js";
import { ctx } from "./ctx/ctx.js";
import {
    fishPNG,
    catnipPNG,
    catnipBarImg,
    healthBarImg,
    lifePNG,
    boarPNG,
    monkeyPNG,
} from "./textures/textures.js";
const assetLoadScreen = document.getElementById("asset-load-screen");
// Preload assets to avoid blank frames when initially loading sprite for changing direction, etc
var allAssets = [];
function preload(assets) {
    assets.forEach((assetPath) => {
        let x = assetPath.includes("sound") ? new Audio() : new Image();
        console.log(assetPath, assetPath.includes("img"));
        if (assetPath.includes("img")) {
            x.src = assetPath;
        }
        allAssets.push(x);
    });
}

// Wait until assets loaded otherwise bad UX and initial render bug

window.addEventListener("load", function () {
    canvas.style.visibility = "visible";
    assetLoadScreen.style.display = "none";
    startGameEngine();
});

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
    // "img/sprite/monkey-jump-left.png",
    // "img/sprite/monkey-jump-right.png",
    "img/sprite/run.png",
    "img/sprite/slide-left.png",
    "img/sprite/slide-right.png",
    "img/sprite/walk-left.png",
    "img/sprite/walk-right.png",
    "img/platform.png",
    "img/platform-moving.png",
    "img/fish.png",
    "img/catnip.png",
    "img/bar-blue.png",
    "img/bar-green.png",
    "img/bar-orange.png",
    "img/bar-red.png",
    "img/platform.png",
    "img/platform-moving.png",
    "img/spike.png",
    "img/life-icon.png",
]);
const startGameEngine = () => {
    const canvas = document.getElementById("canvas");

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

    const keys = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
    };

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
        // enemies = [
        //     new Enemy(300, 0, boarPNG, 720, 512, 1, "boar", false),
        //     new Enemy(1200, 530, monkeyPNG, 640, 600, 3, "monkey", false),
        //     new Enemy(1000, -300, boarPNG, 720, 512, 2, "boar", false),
        //     // new Enemy(800, -350, monkeyPNG, 640, 600, 3, "monkey", false),
        // ];
        healthBarImg.src = barGreen;
        healthBar = new ProgressBar(50, 50, 400, healthBarImg);
        catnipBar = new ProgressBar(50, 150, 0, catnipBarImg);

        player = new Player();
        platforms = platformPositions.map(
            (platform) =>
                new Platform(
                    platform.x,
                    platform.y,
                    platform.image,
                    platform.type
                )
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

            // enemies collision with platforms
            enemies.forEach((enemy) => {
                if (
                    enemy.position.y + enemy.height <= platform.position.y &&
                    enemy.position.y + enemy.height + enemy.velocity.y >=
                        platform.position.y &&
                    enemy.position.x + enemy.width - 50 >=
                        platform.position.x &&
                    enemy.position.x + 50 <=
                        platform.position.x + platform.width
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
};
