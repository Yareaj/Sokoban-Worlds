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
        powerUp: loadSound('./assets/sounds/powerUp.wav')
    }

    // Import the button's fonts into the project
    loadFont('./assets/fonts/Averta.otf');
    loadFont('./assets/fonts/Syntax.otf');
    loadFont('./assets/fonts/SyntaxBlack.otf');
    loadFont('./assets/fonts/SyntaxBold.otf');

    // Import the map string into the global variable
    mapOutline = loadStrings(`/assets/levels/level${levelId}.txt`);

    // Load the buttonStyles JSON file
    buttonStyles = loadJSON('./assets/json/buttonStyles.json');
}

function setup() {
    // Set the map's dimensions once the map has been loaded
    columns = mapOutline[0].length
    rows = mapOutline.length;

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

    menuButtonData = {
        position: {
            x: ((Quadrille.CELL_LENGTH*rows)/2)-(Quadrille.CELL_LENGTH),
            y: ((Quadrille.CELL_LENGTH*columns)/2)-(Quadrille.CELL_LENGTH*0.25)
        },
        size: {
            width: (Quadrille.CELL_LENGTH*2)-(Quadrille.CELL_LENGTH/10),
            height: (Quadrille.CELL_LENGTH*0.75)-(Quadrille.CELL_LENGTH/10)
        }
    }
    
    nextButton = createButton('Next');
    nextButton.position((width/2)+textWidth('Menu')-textWidth('Next'), (height/2));
    nextButton.hide();
    nextButton.mousePressed(loadLevelString);

    menuButton = createButton('Menu');
    menuButton.position((width/2)-textWidth('Menu')-textWidth('Next'), (height/2));
    menuButton.size(menuButtonData.size.width, menuButtonData.size.height);
    menuButton.hide();
    menuButton.mousePressed(toMenu);
    
    // Set up the buttons and style them respectively
    const buttonPropList = Object.keys(buttonStyles);
    for (let propIterator = 0; propIterator<buttonPropList.length ; propIterator++) {
        const propertyName = buttonPropList[propIterator];
        menuButton.style(propertyName, buttonStyles[propertyName]);
        nextButton.style(propertyName, buttonStyles[propertyName]);
    };
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

    // Stop game execution upon finishing the level and create the buttons
    if (levelPass) {
        // Create screening
        fill(color('rgba(36, 166, 91, 0.80)'));
        rect(0,0, Quadrille.CELL_LENGTH*columns, Quadrille.CELL_LENGTH*rows);
        // Display the done level text
        textFont('SyntaxBold');
        textSize(40);
        fill('#000');
        text('Level Passed', menuButtonData.position.x-(textWidth('Level Passed')/3.5), menuButtonData.position.y-menuButtonData.size.height);
        // Show the menu button and next level buttons
        menuButton.show();
        nextButton.show();

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