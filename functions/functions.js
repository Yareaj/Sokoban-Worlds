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

// Go to the menu
function toMenu() {
    window.location.href = "./index.html";
}

// Go to the level player!
function initiateLevelPlay() {
    window.location.href = "./play.html";
}

// Go to the custom landing page!
function toCustom() {
    window.location.href = "./custom.html";
}

function obtainLevelData() {
    customLevelString = textArea.value();

    if (!customLevelString) {
        return alert('Please insert level data');
    }
    localStorage.setItem("mapId", customLevelString);
    initiateLevelPlay();
}