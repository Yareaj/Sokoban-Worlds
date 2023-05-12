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