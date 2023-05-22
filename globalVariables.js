// Definition of asset objects
let images, sounds;

// Creation of box+targets storage array
let boxesQuadrilles = [], targetQuadrilles = [];
let renderBlocks = [ targetQuadrilles, boxesQuadrilles  ];

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

// Definition of the map and it's dimensions
let mapOutline, columns, rows;

// The ID of the map to load!
let levelId = 0;

// Define the button styles
let buttonStyles;