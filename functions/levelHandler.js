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
        levelUp: loadSound('./assets/sounds/levelUp.wav'),
        powerUp: loadSound('./assets/sounds/powerUp.wav'),
        levelAlert: loadSound('./assets/sounds/levelAlert.wav')
    }

    // Import the button's fonts into the project
    loadFont('./assets/fonts/Fredoka-Bold.ttf');
    loadFont('./assets/fonts/Fredoka-Medium.ttf');
    loadFont('./assets/fonts/Fredoka-Regular.ttf');

    // Import the map string into the global variable
    mapOutline = loadStrings(`./assets/levels/level${levelId}.txt`);

    // Load the buttonStyles JSON file
    buttonStyles = loadJSON('./assets/json/levelButtonStyles.json');
}

function setup() {
    // Set the map's dimensions once the map has been loaded
    columns = mapOutline[0].length
    rows = mapOutline.length;

    // Adjust the canvas to the board's exact measurements
    createCanvas(Quadrille.CELL_LENGTH * columns, Quadrille.CELL_LENGTH * rows);
    background('#2f4f4f');

    // Define the level's map dimensions
    levelMap = createQuadrille(columns, rows);

    // Creates an independent quadrille for the player
    playerQuad = createQuadrille([ images.player.up ]);

    // This is where the map outline is properly rendered
    mapData2dArray = processMap(mapOutline);

    // Set the map's standard
    for (let rowIt=0; rowIt<mapData2dArray.length; rowIt++) {
        for (let cellIt=0; cellIt<mapData2dArray[rowIt].length; cellIt++) {
            const cellData = mapData2dArray[rowIt][cellIt];

            // Set the player starting coordinates into the map
            if (cellData[0] == '@') {
                playerPos.row = cellData[1][0];
                playerPos.col = cellData[1][1];
            } else if (cellData[0] == '+') {
                // Player position definiton
                playerPos.row = cellData[1][0];
                playerPos.col = cellData[1][1];
                // Create the target
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].toReversed() ] );
            } else if (cellData[0] == '$') {
                boxesQuadrilles.push( [ createQuadrille([ images.blocks.box ]), cellData[1].toReversed() ] );
            } else if (cellData[0] == '*') {
                boxesQuadrilles.push( [ createQuadrille([ images.blocks.boxSecured ]), cellData[1].toReversed() ] );
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].toReversed() ] );
            } else if (cellData[0] == '.') {
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].toReversed() ] );
            } 
            
            // Set all cells but walls to be the background color
            if (cellData[0] == '#') {
                levelMap._memory2D[rowIt][cellIt] = images.blocks.wall;
            } else {
                levelMap._memory2D[rowIt][cellIt] = color('#2f4f4f');
            }
        }
    }
    
    nextButton = createButton('Next');
    nextButton.position((width/2)+textWidth('Menu')-textWidth('Next'), (height/2));
    nextButton.hide();
    nextButton.mousePressed(nextLevel);

    menuButton = createButton('Menu');
    menuButton.position((width/2)-textWidth('Menu')-textWidth('Next')-20, (height/2));
    menuButton.hide();
    menuButton.mousePressed(toMenu);
    
    // Set up the buttons and style them respectively
    applyStyles(menuButton, buttonStyles);
    applyStyles(nextButton, buttonStyles);
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

    // Add the step counter
    fill('#ffdeb3');
    textFont('Fredoka-Medium');
    textSize(Quadrille.CELL_LENGTH*0.5);
    const xCordSteps = ((width+(Quadrille.CELL_LENGTH/2))/2)-(textWidth('Steps'));
    text(`Steps: ${stepsTaken}`, xCordSteps, Quadrille.CELL_LENGTH/1.5);

    // Add a level indicator top left corner
    textSize(10);
    text(`Level ${levelId}`, 5, 10);

    // Stop game execution upon finishing the level and create the buttons
    if (levelPass) {
        // Create screening
        fill(color('rgba(36, 166, 91, 0.80)'));
        rect(0,0, Quadrille.CELL_LENGTH*columns, Quadrille.CELL_LENGTH*rows);
        // Display the done level text
        textFont('Fredoka-Medium');
        textSize(40);
        fill('#4a3429');
        text('Level Passed', menuButton.x-(textWidth('Level Passed')/5), menuButton.y-menuButton.height*1);
        // Show the menu button and next level buttons
        menuButton.show();
        nextButton.show();
        
        textSize(23);
        text(`Steps: ${stepsTaken}`, xCordSteps, menuButton.y+(23*2.2));

        // Reproduce levelUp audio and make sure it only happens once
        if (successAudio) {
            successAudio = false;
            // To prevent audios overlapping, wait 0.35 seconds before playing levelUp.wav
            setTimeout(()=> {
                sounds.levelUp.play();
            }, 350);
        }
    }
}