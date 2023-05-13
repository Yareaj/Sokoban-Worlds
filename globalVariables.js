// Definition of asset objects
let images, sounds;

// Creation of box+targets storage array
const boxesQuadrilles = [], targetQuadrilles = [];
const renderBlocks = [ targetQuadrilles, boxesQuadrilles  ];

// Definition of quadrilles for scope to reach all functions
let levelMap, playerQuad, mapData2dArray;
const playerPos = {};

// Defining control variables
let placedTargets = 0, levelPass = false, successAudio = true;

// Redefine global variables for customization
Quadrille.CELL_LENGTH = 50;
Quadrille.OUTLINE_WEIGHT = 0;

// Definition of the buttons' data objects
let menuButton, menuButtonData;