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