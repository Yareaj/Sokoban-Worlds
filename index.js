let backgroundImage, customLevelButton, levelListButton;

function preload() {
    // Load assets for render
    backgroundImage = loadImage('./assets/images/menuBg.png');
    menuButtonStyles = loadJSON('./assets/json/menuButtonStyles.json');
    // Load buttons' fonts
    loadFont('./assets/fonts/Fredoka-Bold.ttf');
}

function setup() {
    createCanvas(500, 500);
    customLevelButton = createButton('Custom Level');
    levelListButton = createButton('Play');
}

function draw() {
    image(backgroundImage, 0, 0);

    // Apply styles to the menu buttons
    applyStyles(levelListButton, menuButtonStyles);
    applyStyles(customLevelButton, menuButtonStyles);

    // Position the buttons on the screen
    levelListButton.position(width/2.4, height/1.93);
    customLevelButton.position(width/3.6, height/1.5);

    // Add listeners for button actions
    levelListButton.mousePressed(initiateLevelPlay);
    customLevelButton.mousePressed(customLevelLoad);
}