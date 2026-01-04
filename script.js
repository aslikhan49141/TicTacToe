const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restartBtn");
const modeInputs = document.querySelectorAll('input[name="mode"]');

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let vsAI = true; // Default to AI mode

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    
    // Add event listeners to radio buttons to switch modes
    modeInputs.forEach(input => {
        input.addEventListener("change", function() {
            vsAI = (this.value === "ai");
            restartGame();
        });
    });

    statusText.textContent = `${currentPlayer}'s Turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("data-index");

    // Prevent interaction if cell is taken or game is over
    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    // Trigger AI only if game is running, mode is AI, and it's O's turn
    if (running && vsAI && currentPlayer === "O") {
        setTimeout(aiMove, 500); // Small delay for realism
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
}

function checkWinner() {
    let result = checkWinState(options);

    if (result === "X") {
        statusText.textContent = "X Wins!";
        running = false;
    } else if (result === "O") {
        statusText.textContent = "O Wins!";
        running = false;
    } else if (result === "Tie") {
        statusText.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

// --- AI LOGIC (Minimax Algorithm) ---
function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (options[i] === "") {
            options[i] = "O";
            let score = minimax(options, 0, false);
            options[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    
    const cell = document.querySelector(`.cell[data-index="${move}"]`);
    updateCell(cell, move);
    checkWinner();
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinState(board);
    if (result === "O") return 10 - depth;
    if (result === "X") return -10 + depth;
    if (result === "Tie") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinState(board) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes("")) return "Tie";
    return null;
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
    running = true;
}