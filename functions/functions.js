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

// Load the new map into the global variable mapOutline
function loadLevelString() {
    levelId = levelId + 1;
    // Use callback to reload the map once the string has been processed
    mapOutline = loadStrings(`./levels/level${levelId || 1}.txt`, mapReload);
    levelPass = false;
}

function mapReload() {
    // Reset the level's mechanics
    levelMap = null;
    playerQuad = null;
    mapData2dArray = null;

    // Reset control variables
    placedTargets = 0;
    levelPass = false;
    successAudio = true;

    // Reset object's variebles
    boxesQuadrilles = [];
    targetQuadrilles = [];
    renderBlocks = [ targetQuadrilles, boxesQuadrilles ];
    
    // Hide the menu button
    menuButton.hide()

    // Reload the level
    setup();
}