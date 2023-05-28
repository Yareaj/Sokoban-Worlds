let head;
/**
 * Some sources to include upon the credits
 * https://allbestfonts.com/ (fonts)
 * https://fonts.google.com/specimen/Fredoka
 */

function preload() {
    head = loadImage('./assets/player/head.png');
    loadFont('./assets/fonts/SyntaxBlack.otf');
}

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background('#6f6f');
    image(head, 0, 0);

    textFont('SyntaxBlack');
    textSize(40);
    fill('#000');
    const w = textWidth('Sokoban Worlds');
    text(w, 100, 300);
    text('Sokoban Worlds', 80, 100);
}