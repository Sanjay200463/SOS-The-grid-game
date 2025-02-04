document.addEventListener("DOMContentLoaded", () => {
    const frontPage = document.getElementById("front-page");
    const gamePage = document.getElementById("game-page");
    const playButton = document.getElementById("play-button");

    const board = document.getElementById("board");
    const score1Span = document.getElementById("score1");
    const score2Span = document.getElementById("score2");
    const status = document.getElementById("status");
    const chooseS = document.getElementById("choose-s");
    const chooseO = document.getElementById("choose-o");
    const reset = document.getElementById("reset");

    let currentPlayer = 1;
    let currentLetter = "";
    let scores = [0, 0];
    const size = 5;
    let grid = Array.from({ length: size }, () => Array(size).fill(""));

    playButton.addEventListener("click", () => {
        frontPage.classList.add("hidden");
        gamePage.classList.remove("hidden");
        renderBoard();
    });

    chooseS.addEventListener("click", () => {
        currentLetter = "S";
        status.textContent = `Player ${currentPlayer}'s turn. Place your S.`;
    });

    chooseO.addEventListener("click", () => {
        currentLetter = "O";
        status.textContent = `Player ${currentPlayer}'s turn. Place your O.`;
    });

    reset.addEventListener("click", resetGame);

    function renderBoard() {
        board.innerHTML = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement("div");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.textContent = grid[i][j];
                cell.className = "cell";
                cell.addEventListener("click", () => makeMove(i, j, cell));
                board.appendChild(cell);
            }
        }
    }

    function makeMove(row, col, cell) {
        if (!currentLetter) {
            alert("Choose S or O first!");
            return;
        }
        if (grid[row][col] !== "") {
            alert("Cell already filled!");
            return;
        }
        grid[row][col] = currentLetter;
        cell.textContent = currentLetter;
        checkForSOS(row, col);
        currentLetter = "";
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        status.textContent = `Player ${currentPlayer}'s turn. Choose S or O.`;
    }

    function checkForSOS(row, col) {
        let foundSOS = false;
        let cellsToHighlight = [];

        const directions = [
            [[0, -1], [0, 1]], // Horizontal
            [[-1, 0], [1, 0]], // Vertical
            [[-1, -1], [1, 1]], // Diagonal \ 
            [[-1, 1], [1, -1]] // Diagonal /
        ];

        for (let [dir1, dir2] of directions) {
            let r1 = row + dir1[0], c1 = col + dir1[1];
            let r2 = row + dir2[0], c2 = col + dir2[1];

            if (isValid(r1, c1) && isValid(r2, c2)) {
                if (grid[row][col] === "S" && grid[r1][c1] === "O" && grid[r2][c2] === "S") {
                    foundSOS = true;
                    cellsToHighlight = [[row, col], [r1, c1], [r2, c2]];
                    break; // Stop checking after first SOS found
                }
            }
        }

        if (foundSOS) {
            highlightCells(cellsToHighlight);
            scores[currentPlayer - 1]++;
            score1Span.textContent = scores[0];
            score2Span.textContent = scores[1];

            if (scores[currentPlayer - 1] >= 5) {
                alert(`Player ${currentPlayer} wins!`);
                resetGame();
            }
        }
    }

    function highlightCells(cells) {
        cells.forEach(([r, c]) => {
            let cell = board.children[r * size + c];
            cell.classList.add("highlight");
        });
        setTimeout(() => {
            cells.forEach(([r, c]) => {
                let cell = board.children[r * size + c];
                cell.classList.remove("highlight");
            });
        }, 2000);
    }

    function isValid(r, c) {
        return r >= 0 && r < size && c >= 0 && c < size;
    }

    function resetGame() {
        grid = Array(size).fill("").map(() => Array(size).fill(""));
        scores = [0, 0];
        score1Span.textContent = "0";
        score2Span.textContent = "0";
        renderBoard();
    }

    renderBoard();
});
