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
    } else if (key === 'm') {
        toMenu();
    } else if (key === 'r') {
        loadLevelString();
    }
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
            processedMap[rowExpl][cellExpl] = processedMap[rowExpl][cellExpl].replace(/./, `${processedMap[rowExpl][cellExpl]}|${rowExpl}|${cellExpl}`);
        }
    };

    // Loop to replace the array data into a quadrille builder!
    for (let rowExpl=0; rowExpl<processedMap.length; rowExpl++) {
        // Go through each cell and replace it with the block!
        for (let cellExpl=0; cellExpl<processedMap[rowExpl].length; cellExpl++) {
            const cellData = processedMap[rowExpl][cellExpl].split('|');
            processedMap[rowExpl][cellExpl] = [ cellData[0], [ parseInt(cellData[1]), parseInt(cellData[2]) ] ];
        }
    };

    return processedMap;
}

// Change the level ID
function increaseId() {
    levelId = levelId + 1;
}

// Load the new map into the global variable mapOutline
function loadLevelString() {
    // Use callback to reload the map once the string has been processed
    mapOutline = loadStrings(`./assets/levels/level${levelId}.txt`, mapReload);
    levelPass = false;
    sounds.levelAlert.play();
}

// Go to next level!
function nextLevel() {
    increaseId();
    loadLevelString();
}

function mapReload() {
    // Reset the level's mechanics
    levelMap = null;
    playerQuad = null;
    mapData2dArray = null;

    // Reset control variables
    placedTargets = 0;
    stepsTaken = 0;
    levelPass = false;
    successAudio = true;

    // Reset object's variebles
    boxesQuadrilles = [];
    targetQuadrilles = [];
    renderBlocks = [ targetQuadrilles, boxesQuadrilles ];
    
    // Hide the buttons
    menuButton.hide()
    nextButton.hide()

    // Reload the level
    setup();
}

// Go to the menu
function toMenu() {
    window.location.href = "./index.html";
}

// Go to the level player!
function initiateLevelPlay() {
    window.location.href = "./play.html";
}

// Go to the custom landing page!
function customLevelLoad() {
    console.log('Here relies the custom level loader!');
}