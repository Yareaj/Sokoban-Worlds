// Definition of global variables for scope
let levelMap, images;
const playerPos = { row: 0, col: 0 };

// Game board size
const columns = 5, rows = 5;

// Redefine global variables
//Quadrille.CELL_LENGTH = 30;
//Quadrille.OUTLINE_WEIGHT = 0;

// Load assets before the quadrille is rendered
function preload() {
    images = {
        blocks: {
            wall: loadImage('./assets/blocks/redBrickWall.png'),
            box: loadImage('./assets/blocks/box.png'),
            grayFloor: loadImage('./assets/blocks/rockGrayPath.png'),
            grayDiamond: loadImage('./assets/blocks/grayDiamond.png')
        },
        player: {
            up: loadImage('./assets/player/facingUp.png'),
            down: loadImage('./assets/player/facingDown.png'),
            right: loadImage('./assets/player/facingRight.png'),
            left: loadImage('./assets/player/facingLeft.png')
        }
    }
}

function setup() {
    // Adjust the canvas to the board's exact measurements
    createCanvas(Quadrille.CELL_LENGTH * columns, Quadrille.CELL_LENGTH * rows);

    // Define the level's map
    levelMap = createQuadrille([
        [ 'a', 'b', 'c' ],
        [ 'd', 'e', 'f' ],
        [ 'g', 'h', 'i' ]
    ]);
}

function draw() {
    drawQuadrille(levelMap);
    // This isn't a viable option, it won't clear prior edited cells
    levelMap.fill(playerPos.row, playerPos.col, images.player.down);
}

// Actions based upon the key pressed
function keyPressed() {
    if (keyCode === UP_ARROW || key === 'w') {
        console.log('up');
        playerPos.row += 1;
        //playerPos.row += 1;
    } else if (keyCode === DOWN_ARROW || key === 's') {
        console.log('down');
        //playerPos.row -= 1;
    } else if (keyCode === RIGHT_ARROW || key === 'd') {
        console.log('right');
    } else if (keyCode === LEFT_ARROW || key === 'a') {
        console.log('left');
    }
}