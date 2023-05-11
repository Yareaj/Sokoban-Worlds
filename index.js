// Game board size
const columns = 10, rows = 10;

// Definition of asset objects
let images, sounds;

// Creation of box(es) storage array
const boxesQuadrilles = [];
let boxCords;

// Definition of quadrilles for scope to reach all functions
let levelMap, playerQuad;
const playerPos = { row: 2, col: 2 };

// Redefine global variables for customization
Quadrille.CELL_LENGTH = 50;
Quadrille.OUTLINE_WEIGHT = 0;

// Load assets before quadrilles initalization
function preload() {
    images = {
        blocks: {
            wall: loadImage('./assets/blocks/redBrickWall.png'),
            box: loadImage('./assets/blocks/box.png'),
            boxTarget: loadImage('./assets/blocks/boxTarget.png'),
            boxSecured: loadImage('./assets/blocks/boxSecured.png'),
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
    background('#2f4f4f');

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
                levelMap._memory2D[itRows][itColumns] = color('#2f4f4f');
            }
        }
    }

    /* boxesQuadrilles[0] = [5,6];
    boxesQuadrilles[1] = [5,5];

    for (let iterator=0; iterator<boxesQuadrilles.length; iterator++) {
        boxesQuadrilles[iterator] = [ createQuadrille([ images.blocks.box ]), [ iterator+2, iterator+3 ] ];
    } */

    boxesQuadrilles[0] = [ createQuadrille([ images.blocks.box ]), [ 3, 2 ] ];
    boxesQuadrilles[1] = [ createQuadrille([ images.blocks.box ]), [ 3, 5 ] ];
}

function draw() {
    drawQuadrille(levelMap);

    // Insert the player onto the main quadrille given a specific position
    drawQuadrille(playerQuad, {
        x: playerPos.col * Quadrille.CELL_LENGTH,
        y: playerPos.row * Quadrille.CELL_LENGTH,
        outline: 'green'
    });

    for (let boxIterator=0; boxIterator<boxesQuadrilles.length; boxIterator++) {
        drawQuadrille(boxesQuadrilles[boxIterator][0], {
            x: boxesQuadrilles[boxIterator][1][0] * Quadrille.CELL_LENGTH,
            y: boxesQuadrilles[boxIterator][1][1] * Quadrille.CELL_LENGTH,
        });
    }
}

// Actions based upon the key pressed
function keyPressed() {
    if (keyCode === UP_ARROW || key === 'w') {
        playerQuad._memory2D[0][0] = images.player.up;

        if (objectAhead(playerPos.row, playerPos.col, 'up', 'wall')[0]) {
            return sounds.forbidden.play();
        }

        const isBox = objectAhead(playerPos.row, playerPos.col, 'up', 'box');
        if (isBox[0]) {
            if (isThereBlockInterference(isBox[1], 'up')) {
                return sounds.forbidden.play();
            } else {
                moveBox(isBox[1], 'up');
                playerPos.row -= 1;
                return sounds.step.play();
            }
        }
        playerPos.row -= 1;
        sounds.step.play();

    } else if (keyCode === DOWN_ARROW || key === 's') {
        playerQuad._memory2D[0][0] = images.player.down;

        if (objectAhead(playerPos.row, playerPos.col, 'down', 'wall')[0]) {
            return sounds.forbidden.play();
        }

        const isBox = objectAhead(playerPos.row, playerPos.col, 'down', 'box');
        if (isBox[0]) {
            if (isThereBlockInterference(isBox[1], 'down')) {
                return sounds.forbidden.play();
            } else {
                moveBox(isBox[1], 'down');
                playerPos.row += 1;
                return sounds.step.play();
            }
        }
        playerPos.row += 1;
        sounds.step.play();

    } else if (keyCode === LEFT_ARROW || key === 'a') {
        playerQuad._memory2D[0][0] = images.player.left;
        
        if (objectAhead(playerPos.row, playerPos.col, 'left', 'wall')[0]) {
            return sounds.forbidden.play();
        }

        const isBox = objectAhead(playerPos.row, playerPos.col, 'left', 'box');
        if (isBox[0]) {
            if (isThereBlockInterference(isBox[1], 'left')) {
                return sounds.forbidden.play();
            } else {
                moveBox(isBox[1], 'left');
                playerPos.col -= 1;
                return sounds.step.play();
            }
        }
        playerPos.col -= 1;
        sounds.step.play();

    } else if (keyCode === RIGHT_ARROW || key === 'd') {
        playerQuad._memory2D[0][0] = images.player.right;

        if (objectAhead(playerPos.row, playerPos.col, 'right', 'wall')[0]) {
            return sounds.forbidden.play();
        }

        const isBox = objectAhead(playerPos.row, playerPos.col, 'right', 'box');
        if (isBox[0]) {
            if (isThereBlockInterference(isBox[1], 'right')) {
                return sounds.forbidden.play();
            } else {
                moveBox(isBox[1], 'right');
                playerPos.col += 1;
                return sounds.step.play();
            }
        }
        playerPos.col += 1;
        sounds.step.play();
    }  else if (keyCode === ESCAPE) {
        console.log(objectAhead(playerPos.row, playerPos.col, 'up', 'wall')[0])
    }
}

// Function that determines wether there is an object in the player's direction, if a box, returns the index within the quadrille array
function objectAhead(rowCord, colCord, direction, objectToFind) {
    // Define the boolean to store wether or not the character is going towards the object
    let headingToObject = [ false, -1 ];

    // Object to define the final cell based on the direction
    const dirInstructions = {
        'up': { rowFinalCord: rowCord-1, colFinalCord: colCord },
        'down': { rowFinalCord: rowCord+1, colFinalCord: colCord },
        'left': { rowFinalCord: rowCord, colFinalCord: colCord-1 },
        'right': { rowFinalCord: rowCord, colFinalCord: colCord+1 }
    }

    // Define the coordinate the character will lead to
    const destinyCell = [ dirInstructions[direction].rowFinalCord, dirInstructions[direction].colFinalCord ];

    // Determine action row based on what object is the target
    if (objectToFind === 'wall') {
        if (levelMap.read(destinyCell[0], destinyCell[1]) == images.blocks.wall) {
            headingToObject[0] = true;
        }
    } else if (objectToFind === 'box') {
        // We invert the destinyCell confirmation format since x=columns and y=rows
        const foundBox = boxesQuadrilles.findIndex(boxData => boxData[1][0] == destinyCell[1] && boxData[1][1] == destinyCell[0]);

        if (foundBox>=0) {
            headingToObject = [ true, foundBox ];
        }
    }

    return headingToObject;
}

// Determine wether the box is able to move into the desired direction or not
function isThereBlockInterference(boxIndex, direction) {
    const boxCords = boxesQuadrilles[boxIndex][1];
    return objectAhead(boxCords[1], boxCords[0], direction, 'wall')[0] || objectAhead(boxCords[1], boxCords[0], direction, 'box')[0];
}

// Function to move a box across the map
function moveBox(boxIndex, direction) {
    const boxCords = boxesQuadrilles[boxIndex][1];

    // Object to define the box's destiny cell based on the direction
    const dirInstructions = {
        'up': { rowFinalCord: boxCords[1]-1, colFinalCord: boxCords[0] },
        'down': { rowFinalCord: boxCords[1]+1, colFinalCord: boxCords[0] },
        'left': { rowFinalCord: boxCords[1], colFinalCord: boxCords[0]-1 },
        'right': { rowFinalCord: boxCords[1], colFinalCord: boxCords[0]+1 }
    }

    // Define the coordinate the box shall move towards
    const boxDestinyCell = [ dirInstructions[direction].rowFinalCord, dirInstructions[direction].colFinalCord ];

    boxesQuadrilles[boxIndex][1] = [ boxDestinyCell[1], boxDestinyCell[0] ];
}