// Definition of quadrilles for scope to reach all functions
let levelMap, playerQuad;

// Definition of asset objects
let images, sounds;
const playerPos = { row: 2, col: 2 };

// Game board size
const columns = 10, rows = 10;

// Redefine global variables
Quadrille.CELL_LENGTH = 50;
Quadrille.OUTLINE_WEIGHT = 0;

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
            left: loadImage('./assets/player/facingLeft.png'),
            right: loadImage('./assets/player/facingRight.png')
        }
    }
    sounds = {
        step: loadSound('./assets/sounds/step.wav'),
        success: loadSound('./assets/sounds/success.wav'),
        forbidden: loadSound('./assets/sounds/forbidden.wav')
    }
}

function setup() {
    // Adjust the canvas to the board's exact measurements
    createCanvas(Quadrille.CELL_LENGTH * columns, Quadrille.CELL_LENGTH * rows);

    // Define the level's map dimensions
    levelMap = createQuadrille(rows, columns);

    // Creates an independent quadrille for the player
    playerQuad = createQuadrille([ images.player.up ]);

    // Make all first/last columns/rows to be walls
    for (let itRows=0; itRows<rows; itRows++) {
        for (let itColumns=0; itColumns<columns; itColumns++) {
            if (itRows == 0 || itRows == rows-1 || itColumns == 0 || itColumns == columns-1) {
                levelMap._memory2D[itRows][itColumns] = images.blocks.wall;
            } else {
                levelMap._memory2D[itRows][itColumns] = images.blocks.grayFloor;
            }
        }
    }
}

function draw() {
    drawQuadrille(levelMap);

    // Insert the player onto the main quadrille given a specific position
    drawQuadrille(playerQuad, {
        x: playerPos.col * Quadrille.CELL_LENGTH,
        y: playerPos.row * Quadrille.CELL_LENGTH,
        outline: 'green'
    });
}

// Actions based upon the key pressed
function keyPressed() {
    if (keyCode === UP_ARROW || key === 'w') {
        playerQuad._memory2D[0][0] = images.player.up;

        if (wallAhead(playerPos.row, playerPos.col, 'up')) {
            return sounds.forbidden.play();
        }   
        
        playerPos.row -= 1;
        sounds.step.play();

    } else if (keyCode === DOWN_ARROW || key === 's') {
        playerQuad._memory2D[0][0] = images.player.down;

        if (wallAhead(playerPos.row, playerPos.col, 'down')) {
            return sounds.forbidden.play();
        } 

        playerPos.row += 1;
        sounds.step.play();

    } else if (keyCode === LEFT_ARROW || key === 'a') {
        playerQuad._memory2D[0][0] = images.player.left;
        
        if (wallAhead(playerPos.row, playerPos.col, 'left')) {
            return sounds.forbidden.play();
        }
        
        playerPos.col -= 1;
        sounds.step.play();

    } else if (keyCode === RIGHT_ARROW || key === 'd') {
        playerQuad._memory2D[0][0] = images.player.right;

        if (wallAhead(playerPos.row, playerPos.col, 'right')) {
            return sounds.forbidden.play();
        }

        playerPos.col += 1;
        sounds.step.play();
    } 
}

// Function that given the player's position on the quadrille determines if next location is wall blocked
function wallAhead(rowCord, colCord, direction) {
    // Define the boolean to store wether or not the character will hit a wall
    let isThereAWall = false;

    // Object to define the final cell based on the direction
    const dirInstructions = {
        'up': { rowFinalCord: rowCord-1, colFinalCord: colCord },
        'down': { rowFinalCord: rowCord+1, colFinalCord: colCord },
        'left': { rowFinalCord: rowCord, colFinalCord: colCord-1 },
        'right': { rowFinalCord: rowCord, colFinalCord: colCord+1 }
    }

    // Define the coordinate the character will lead to
    const destinyCell = [ dirInstructions[direction].rowFinalCord, dirInstructions[direction].colFinalCord ];
    
    if (levelMap.read(destinyCell[0], destinyCell[1]) == images.blocks.wall) {
        isThereAWall = true
    }

    return isThereAWall;
}