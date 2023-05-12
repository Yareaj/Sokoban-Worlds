// Definition of asset objects
let images, sounds;

// Creation of box+targets storage array
const boxesQuadrilles = [], targetQuadrilles = [];
const renderBlocks = [ targetQuadrilles, boxesQuadrilles  ];

// Definition of quadrilles for scope to reach all functions
let levelMap, playerQuad;
const playerPos = {};

// Defining control variables
let placedTargets = 0, levelPass = false;

// Redefine global variables for customization
Quadrille.CELL_LENGTH = 50;
Quadrille.OUTLINE_WEIGHT = 0;

const mapOutline = `wwwwwwwwww
wffffffffw
wfffpffffw
wfbfffbffw
wffffffffw
wwwwfffffw
wffftfwffw
wfffffwffw
wfftffwffw
wwwwwwwwww`.split('\n');

// Game board size
const columns = mapOutline[0].length, rows = mapOutline.length;

let mapData2dArray;

// Load assets before quadrilles initalization
function preload() {
    images = {
        blocks: {
            wall: loadImage('./assets/blocks/redBrickWall.png'),
            box: loadImage('./assets/blocks/box.png'),
            boxTarget: loadImage('./assets/blocks/boxTarget.png'),
            boxSecured: loadImage('./assets/blocks/boxSecured.png'),
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
        forbidden: loadSound('./assets/sounds/forbidden.wav'),
        levelUp: loadSound('./assets/sounds/levelUp.wav')
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

    // This is where the map outline is properly rendered
    mapData2dArray = processMap(mapOutline);

    // Set the map's standard
    for (let rowIt=0; rowIt<mapData2dArray.length; rowIt++) {
        for (let cellIt=0; cellIt<mapData2dArray[rowIt].length; cellIt++) {
            // Set the player starting coordinates into the map
            if (mapData2dArray[rowIt][cellIt][0] == 'p') {
                playerPos.row = mapData2dArray[rowIt][cellIt][1][0];
                playerPos.col = mapData2dArray[rowIt][cellIt][1][1];
            } else if (mapData2dArray[rowIt][cellIt][0] == 'b') {
                boxesQuadrilles.push( [ createQuadrille([ images.blocks.box ]), mapData2dArray[rowIt][cellIt][1].reverse() ] );
            } else if (mapData2dArray[rowIt][cellIt][0] == 't') {
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), mapData2dArray[rowIt][cellIt][1].reverse() ] );
            } 
            
            // Set all cells but walls to be the background color
            if (mapData2dArray[rowIt][cellIt][0] == 'w') {
                levelMap._memory2D[rowIt][cellIt] = images.blocks.wall;
            } else {
                levelMap._memory2D[rowIt][cellIt] = color('#2f4f4f');
            }
        }
    }

    // Render all targets and then render all boxes
    for (let arrayBlockIt=0; arrayBlockIt<renderBlocks.length; arrayBlockIt++) {
        for (let singleIt=0; singleIt<renderBlocks[arrayBlockIt].length; singleIt++) {
            //console.log(renderBlocks[arrayBlockIt][singleIt][0]);
        }
    }
}

function draw() {
    drawQuadrille(levelMap);

    // Render all targets and then render all boxes
    for (let arrayBlockIt=0; arrayBlockIt<renderBlocks.length; arrayBlockIt++) {
        for (let singleIt=0; singleIt<renderBlocks[arrayBlockIt].length; singleIt++) {
            drawQuadrille(renderBlocks[arrayBlockIt][singleIt][0], {
                x: renderBlocks[arrayBlockIt][singleIt][1][0] * Quadrille.CELL_LENGTH,
                y: renderBlocks[arrayBlockIt][singleIt][1][1] * Quadrille.CELL_LENGTH,
            });
        }
    }

    // Insert the player onto the main quadrille given a specific position
    drawQuadrille(playerQuad, {
        x: playerPos.col * Quadrille.CELL_LENGTH,
        y: playerPos.row * Quadrille.CELL_LENGTH,
        outline: 'green'
    });

    // Stop game execution upon finishing the level
    if (levelPass) {
        fill('rgb(0,255,0)');
        textSize(30);
        text('YOU PASSED THIS LEVEL DUDE', 25, 40);
    }
}

// Actions based upon the key pressed
function keyPressed() {
    // Prevent keys to take effects upon level pass
    if (levelPass) {
        return;
    }

    if (keyCode === UP_ARROW || key === 'w') {
        playerMove('up');
    } else if (keyCode === DOWN_ARROW || key === 's') {
        playerMove('down');
    } else if (keyCode === LEFT_ARROW || key === 'a') {
        playerMove('left');
    } else if (keyCode === RIGHT_ARROW || key === 'd') {
        playerMove('right');
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

// Function to store recurrent movements to place within the keyPressed() function
function playerMove(direction) {
    playerQuad._memory2D[0][0] = images.player[direction];

    if (objectAhead(playerPos.row, playerPos.col, direction, 'wall')[0]) {
        return sounds.forbidden.play();
    }

    const isBox = objectAhead(playerPos.row, playerPos.col, direction, 'box');
    if (isBox[0]) {
        if (isThereBlockInterference(isBox[1], direction)) {
            return sounds.forbidden.play();
        } else {
            // Move the box to the desired destiny
            moveBox(isBox[1], direction);

            // Determine wether the box lands on a target
            boxOnTarget(isBox[1]);
            
            if (direction == 'up') { 
                playerPos.row -= 1;
            } else if (direction == 'down') {
                playerPos.row += 1;
            } else if (direction == 'left') {
                playerPos.col -= 1;
            } else if (direction == 'right') {
                playerPos.col += 1;
            }
            return sounds.step.play();
        }
    }
    
    if (direction == 'up') { 
        playerPos.row -= 1;
    } else if (direction == 'down') {
        playerPos.row += 1;
    } else if (direction == 'left') {
        playerPos.col -= 1;
    } else if (direction == 'right') {
        playerPos.col += 1;
    }

    sounds.step.play();
}

// Function to determine wether a box is over a target and update it's skin
function boxOnTarget(boxIndex) {
    const box = boxesQuadrilles[boxIndex];
    
    const foundTarget = targetQuadrilles.find(targetData => targetData[1][0] == box[1][0] && targetData[1][1] == box[1][1]);

    if (foundTarget) {
        box[0]._memory2D[0][0] = images.blocks.boxSecured;
        sounds.success.play();
    } else {
        box[0]._memory2D[0][0] = images.blocks.box;
    }

    // Count the boxes that are placed on a target
    const placedBoxes = boxesQuadrilles.filter(box => box[0].read(0,0) == images.blocks.boxSecured);
    placedTargets = placedBoxes.length;
    levelPass = targetQuadrilles.length == placedTargets;
}

// Function to process a string into a map
function processMap(mapString) {
    let processedMap = [];

    mapString.forEach(row => {
        processedMap.push(row.split(''));
    });

    // Loop to replace the map outline into something we can use!
    for (let rowExpl=0; rowExpl<processedMap.length; rowExpl++) {
        // Go through each cell and replace it with the needed properties for the builder
        for (let cellExpl=0; cellExpl<processedMap[rowExpl].length; cellExpl++) {
            processedMap[rowExpl][cellExpl] = processedMap[rowExpl][cellExpl].replace(/\w/, `${processedMap[rowExpl][cellExpl]}|${rowExpl}|${cellExpl}`);
        }
    };

    // Loop to replace the array data into a quadrille builder!
    for (let rowExpl=0; rowExpl<processedMap.length; rowExpl++) {
        // Go through each cell and replace it with the block!
        for (let cellExpl=0; cellExpl<processedMap[rowExpl].length; cellExpl++) {
            const cellData = processedMap[rowExpl][cellExpl].split('|');
            processedMap[rowExpl][cellExpl] = [ cellData[0], [ parseInt(cellData[1]), parseInt(cellData[2]) ] ]
        }
    };

    return processedMap;
}