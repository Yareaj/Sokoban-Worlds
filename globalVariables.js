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
Quadrille.cellLength = 50;
Quadrille.outlineWeight = 0;

// Definition of the map and it's dimensions
let mapOutline, columns, rows;

// The ID of the map to load!
let levelId = 0;

// Define the button styles
let levelButtonStyles, menuButtonStyles;

// Define the step counter variable
let stepsTaken = 0;