const gridSize = 5;
let mineCount = 5; // Default mine count
let gameGrid = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;

// Function to start or restart the game
function startGame() {
    mineCount = parseInt(document.getElementById('mine-count').value);
    score = 0;
    gameOver = false;
    gameGrid = Array(gridSize * gridSize).fill(false);

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let index = Math.floor(Math.random() * gameGrid.length);
        if (!gameGrid[index]) {
            gameGrid[index] = true; // true means a mine
            minesPlaced++;
        }
    }

    // Render the grid
    renderGrid();
    updateStatus();
}

// Function to render the game grid
function renderGrid() {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = ''; // Clear previous grid

    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;

        tile.addEventListener('click', () => revealTile(i));

        gameContainer.appendChild(tile);
    }
}

// Function to handle tile reveal
function revealTile(index) {
    if (gameOver || gameGrid[index] === 'revealed') return;

    const tile = document.querySelector(`.tile[data-index='${index}']`);

    if (gameGrid[index]) {
        // Mine clicked
        tile.classList.add('mine');
        tile.textContent = '💣';
        gameOver = true;
        score = 0; // Lose all score if a mine is hit
        updateStatus("Game Over! You hit a mine and lost all your score.");
        revealAllTiles();
        checkHighScore();
    } else {
        // Safe tile
        tile.classList.add('safe');
        gameGrid[index] = 'revealed';

        // Increase score based on number of mines
        const points = mineCount * 10;
        score += points;
        updateStatus(`Score: ${score}`);
    }
}

// Function to reveal all tiles when game ends
function revealAllTiles() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.querySelector(`.tile[data-index='${i}']`);
        if (gameGrid[i] === true && !tile.classList.contains('mine')) {
            // Show mine
            tile.classList.add('mine');
            tile.textContent = '💣';
        } else if (gameGrid[i] === false && tile.childElementCount === 0) {
            // Mark safe tile as green
            tile.classList.add('safe');
        }
    }
}

// Function to update the status message
function updateStatus(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message || `Score: ${score}`;
}

// Function to check and update high score
function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

// Function to update the high score display
function updateHighScore() {
    const highScoreDiv = document.getElementById('high-score');
    highScoreDiv.innerHTML = `High Score: ${highScore} <button onclick="resetHighScore()">Reset High Score</button>`;
}

// Function to reset high score
function resetHighScore() {
    highScore = 0;
    localStorage.setItem('highScore', highScore);
    updateHighScore();
}

// Function to save the game, keep the score, update high score, and reset the game
function saveGame() {
    gameOver = true;
    checkHighScore();
    startGame();
    updateStatus("Game Saved! Final Score: " + score);
}

// Initialize high score on load
window.onload = function() {
    highScore = localStorage.getItem('highScore') || 0;
    updateHighScore();
    startGame();
};
