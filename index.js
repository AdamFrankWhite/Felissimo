const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// set width and height to viewport dimensions

canvas.width = innerWidth;
canvas.height = innerHeight;

// Access sprite sheet

const catWalkSprite = new Image();
catWalkSprite.src = "./img/sprite/cat_sprite.png";
catWalkSprite.onload = loadImages;

// 10 different walk images
let cols = 10;
let spriteWidth = catWalkSprite.width / 10;
let spriteHeight = catWalkSprite.height / 16;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
let totalFrames = 10;
let currentFrame = 0;

// Count frames drawn
let framesDrawn = 0;
let direction = 1;
let offSetLeft = direction == 1 ? 0 : spriteWidth;
// Update source position
let srcX = 0;
let srcY = 8 * spriteHeight;

let destX = 0;
let destY = 0;

// Scale + positioning
let scaleFactor = 0.2;
let XPos = innerWidth / 2 - spriteWidth * scaleFactor;
let YPos = innerHeight - spriteHeight * scaleFactor;

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);

    // Work out current frame number
    currentFrame = currentFrame % totalFrames;
    srcX = currentFrame * spriteWidth; // update src position to next image in sprite
    // image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight

    ctx.save();
    resizeImage();

    ctx.drawImage(
        catWalkSprite,
        srcX,
        srcY,
        spriteWidth,
        spriteHeight,
        destX,
        destY,
        spriteWidth,
        spriteHeight
    );

    ctx.restore();
    framesDrawn++;
    if (framesDrawn >= 6) {
        currentFrame++;
        framesDrawn = 0;
    }
};

function resizeImage() {
    ctx.translate(XPos, YPos);
    ctx.scale(scaleFactor, scaleFactor);
}

// So canvas doesn't render before the image

let numOfImages = 1;
function loadImages() {
    if (--numOfImages > 0) return;
    animate();
}
// Handle sprite on click

var keyState = {};
window.addEventListener(
    "keydown",
    function (e) {
        keyState[e.key] = true;
    },

    true
);
window.addEventListener(
    "keyup",
    function (e) {
        keyState[e.key] = false;
        if (e.key == "ArrowLeft") {
            srcY = 9 * spriteHeight;
            totalFrames = 10;
            if (XPos > spriteWidth * scaleFactor) {
                XPos -= 6;
            }
        }
        if (e.key == "ArrowRight") {
            srcY = 8 * spriteHeight;
            totalFrames = 10;
            if (XPos < canvas.width - spriteWidth * scaleFactor) {
                XPos += 6;
            }
        }
        if (e.key == " ") {
            srcY = 1 * spriteHeight;
            totalFrames = 10;
        }
    },

    true
);

function gameLoop() {
    // const idle = keyState.values(keyState).every((x) => x === null || x === "");
    if (keyState["ArrowLeft"]) {
        if (XPos > 10) {
            XPos -= 5;
            srcY = 1 * spriteHeight;
        }

        totalFrames = 10;
    }
    if (keyState["ArrowRight"]) {
        if (XPos < innerWidth - spriteWidth * scaleFactor) {
            XPos += 5;
            srcY = 0 * spriteHeight;
        }
        totalFrames = 10;
    }
    // if (keyState["ArrowLeft"] && keyState[" "]) {
    //     srcY = 1 * spriteHeight;
    //     totalFrames = 10;
    // }

    // if (keyState["ArrowRight"] && keyState[" "]) {
    //     srcY = 1 * spriteHeight;
    //     totalFrames = 10;
    // }
    if (keyState[" "]) {
        // srcY = 5 * spriteHeight;
        totalFrames = 7;
        if (YPos > 100) {
            YPos -= 6;
            setTimeout(() => {
                YPos += 6;
                // srcY = 12 * spriteHeight;
            }, 500);
        }
    }
    // else if (
    //     !keyState[" "] &&
    //     !keyState["ArrowLeft"] &&
    //     !keyState["ArrowRight"]
    // ) {
    //     if (YPos + spriteHeight * scaleFactor == innerHeight) {
    //         srcY = 8 * spriteHeight;
    //     }
    // }

    setTimeout(gameLoop, 20);
}
gameLoop();
