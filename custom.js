let submitButton, textArea;

function preload() {
    // Load assets for render
    backgroundImage = loadImage('./assets/images/menuBg.png');
    levelButtonStyles = loadJSON('./assets/json/levelButtonStyles.json');
    // Load buttons' fonts
    loadFont('./assets/fonts/Fredoka-Medium.ttf');
}

function setup() {
    createCanvas(500, 500);
    submitButton = createButton('Submit');
    textArea = createElement('textarea');

    // Apply styles to the menu buttons
    applyStyles(submitButton, levelButtonStyles);

    // Apply styles to the text area
    textArea.style('width', `${width-50}px`);
    textArea.style('height', `${height/3}px`);
    textArea.style('resize', 'none');
    textArea.attribute('placeholder', 'Insert the menu data');
    textArea.attribute('required', true);
    textArea.position(30, height/1.97);

    // Position the submit button on the screen
    submitButton.position(width/2.4, (height/1.95)+(height/3)+20);

    submitButton.mousePressed(obtainLevelData);
}

function draw() {
    image(backgroundImage, 0, 0);
}