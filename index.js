let head;

function preload() {
    head = loadImage('./assets/player/head.png');
    loadFont('./assets/fonts/Fredoka-Medium.ttf');
}

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background('#6f6f');
    image(head, 0, 0);

    textFont('Fredoka-Medium');
    textSize(40);
    fill('#000');
    const w = textWidth('Sokoban Worlds');
    text(w, 100, 300);
    text('Sokoban Worlds', 80, 100);
}