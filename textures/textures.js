const platformTexture = new Image();
platformTexture.src = "./img/platform.png";

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

const movingPlatformTexture = new Image();
movingPlatformTexture.src = "./img/platform-moving.png";
const spikeImg = new Image();
spikeImg.src = "./img/spike.png";
const lifePNG = new Image();
lifePNG.src = "./img/life-icon.png";
const platformSlopeRight = new Image();
platformSlopeRight.src = "./img/platform-slope-right.png";

export {
    platformTexture,
    fishPNG,
    catnipPNG,
    catnipBarImg,
    healthBarImg,
    movingPlatformTexture,
    spikeImg,
    boarPNG,
    monkeyPNG,
    lifePNG,
    platformSlopeRight,
};
