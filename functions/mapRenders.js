// Reset a level's canvas
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

// Render all of the quadrilles into the canvas
function renderFullMapQuadrilles() {
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
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].reverse() ] );
            } else if (cellData[0] == '$') {
                boxesQuadrilles.push( [ createQuadrille([ images.blocks.box ]), cellData[1].reverse() ] );
            } else if (cellData[0] == '*') {
                boxesQuadrilles.push( [ createQuadrille([ images.blocks.boxSecured ]), cellData[1].reverse() ] );
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].reverse() ] );
            } else if (cellData[0] == '.') {
                targetQuadrilles.push( [ createQuadrille([ images.blocks.boxTarget ]), cellData[1].reverse() ] );
            } 
            
            // Set all cells but walls to be the background color
            if (cellData[0] == '#') {
                levelMap._memory2D[rowIt][cellIt] = images.blocks.wall;
            } else {
                levelMap._memory2D[rowIt][cellIt] = color('#2f4f4f');
            }
        }
    }
}