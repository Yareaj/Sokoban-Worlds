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
wffftffffw
wwwwfffffw
wfffbfwtfw
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