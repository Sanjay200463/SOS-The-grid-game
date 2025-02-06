// DOM Elements
const frontPage = document.getElementById("front-page");
const gamePage = document.getElementById("game-page");
const playButton = document.getElementById("play-button");
const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
const chooseSButton = document.getElementById("choose-s");
const chooseOButton = document.getElementById("choose-o");
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

// Variables
let currentPlayerNumber = 1;
let currentPlayerChoice = null;
let scores = [0, 0];
let gameState = Array(25).fill(null);
const size = 5;
let gameActive = true;

// Play button functionality
playButton.addEventListener("click", () => {
    frontPage.style.display = "none";
    gamePage.classList.add("active");
});

// Generate winning combinations
function generateWinningCombinations() {
    const combinations = [];

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 2; j++) {
            combinations.push([i * size + j, i * size + j + 1, i * size + j + 2]);
            combinations.push([j * size + i, (j + 1) * size + i, (j + 2) * size + i]);
        }
    }

    for (let i = 0; i < size - 2; i++) {
        for (let j = 0; j < size - 2; j++) {
            combinations.push([
                i * size + j,
                (i + 1) * size + j + 1,
                (i + 2) * size + j + 2,
            ]);
            combinations.push([
                i * size + j + 2,
                (i + 1) * size + j + 1,
                (i + 2) * size + j,
            ]);
        }
    }

    return combinations;
}

const winningCombinations = generateWinningCombinations();

// Create the board dynamically
function createBoard() {
    board.innerHTML = '';
    gameState.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    });
}

// Handle cell click
function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);

    if (!gameState[index] && gameActive && currentPlayerChoice) {
        gameState[index] = currentPlayerChoice;
        event.target.textContent = currentPlayerChoice;
        event.target.classList.add("taken");

        const points = checkForSOS(index);
        scores[currentPlayerNumber - 1] += points;

        score1Display.textContent = scores[0];
        score2Display.textContent = scores[1];

        if (scores[currentPlayerNumber - 1] >= 5) {
            status.textContent = `Player ${currentPlayerNumber} wins!`;
            gameActive = false;
            return;
        }

        if (points > 0) {
            status.textContent = `Player ${currentPlayerNumber} scored ${points} point(s)! Choose again.`;
        } else {
            currentPlayerNumber = currentPlayerNumber === 1 ? 2 : 1;
            currentPlayerChoice = null;
            status.textContent = `Player ${currentPlayerNumber}'s turn. Choose S or O.`;
        }
    }
}

function checkForSOS(index) {
    let points = 0;

    winningCombinations.forEach(([a, b, c]) => {
        if (
            (a === index || b === index || c === index) &&
            gameState[a] === "S" &&
            gameState[b] === "O" &&
            gameState[c] === "S"
        ) {
            points++;
            highlightSOS([a, b, c]);
        }
    });

    return points;
}

function highlightSOS(indices) {
    indices.forEach((index) => {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add("highlight");
    });
}

chooseSButton.addEventListener("click", () => {
    if (!currentPlayerChoice && gameActive) {
        currentPlayerChoice = "S";
        status.textContent = `Player ${currentPlayerNumber} chose S. Select a cell.`;
    }
});

chooseOButton.addEventListener("click", () => {
    if (!currentPlayerChoice && gameActive) {
        currentPlayerChoice = "O";
        status.textContent = `Player ${currentPlayerNumber} chose O. Select a cell.`;
    }
});

resetButton.addEventListener("click", () => {
    gameState = Array(25).fill(null);
    scores = [0, 0];
    currentPlayerNumber = 1;
    currentPlayerChoice = null;
    gameActive = true;

    score1Display.textContent = 0;
    score2Display.textContent = 0;
    status.textContent = `Player ${currentPlayerNumber}'s turn. Choose S or O.`;
    createBoard();
});

createBoard();
