document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 7;
    const maxNumber = 100;
    const bingoBoard = document.getElementById("bingo-board");
    const drawButton = document.getElementById("draw-button");
    const resetButton = document.getElementById("reset-button");
    const drawnNumberElement = document.getElementById("drawn-number");
    const messageElement = document.getElementById("message");

    let drawnNumbers = new Set();
    let boardNumbers = [];
    let failClicks = 0;
    let gameOver = false;

    function generateBoard() {
        bingoBoard.innerHTML = "";
        const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
        shuffleArray(numbers);
        boardNumbers = numbers.slice(0, boardSize * boardSize);
        let index = 0;

        for (let i = 0; i < boardSize; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement("td");
                cell.textContent = boardNumbers[index];
                cell.dataset.number = boardNumbers[index];
                cell.addEventListener("click", () => handleCellClick(cell));
                row.appendChild(cell);
                index++;
            }
            bingoBoard.appendChild(row);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function drawNumber() {
        if (drawnNumbers.size >= maxNumber || gameOver) {
            messageElement.textContent = "כל המספרים הוגרלו או שהמשחק הסתיים!";
            return;
        }
        let number;
        do {
            number = Math.floor(Math.random() * maxNumber) + 1;
        } while (drawnNumbers.has(number));
        drawnNumbers.add(number);
        drawnNumberElement.textContent = `המספר שהוגרל: ${number}`;
        messageElement.textContent = "";
    }

    function handleCellClick(cell) {
        if (gameOver) return;
        const number = parseInt(cell.dataset.number);
        if (!drawnNumbers.has(number)) {
            failClicks++;
            messageElement.textContent = `המספר לא הוגרל! (${failClicks}/3)`;
            if (failClicks >= 3) {
                messageElement.textContent = "נפסלת! לחצת 3 פעמים על מספרים שלא הוגרלו.";
                gameOver = true;
            }
            return;
        }
        if (cell.classList.contains("marked")) return;
        cell.classList.add("marked");
        cell.innerHTML = '<span style="color:red;font-size:1.5em;">&#10006;</span>';
        checkWinner();
    }

    function checkWinner() {
        const rows = bingoBoard.querySelectorAll("tr");
        for (let i = 0; i < boardSize; i++) {
            const row = rows[i].querySelectorAll("td");
            if (Array.from(row).every(cell => cell.classList.contains("marked"))) {
                messageElement.textContent = "ניצחת! השלמת שורה.";
                gameOver = true;
                return;
            }
        }
        for (let i = 0; i < boardSize; i++) {
            let columnMarked = true;
            for (let j = 0; j < boardSize; j++) {
                const cell = rows[j].querySelectorAll("td")[i];
                if (!cell.classList.contains("marked")) {
                    columnMarked = false;
                    break;
                }
            }
            if (columnMarked) {
                messageElement.textContent = "ניצחת! השלמת טור.";
                gameOver = true;
                return;
            }
        }
    }

    function resetGame() {
        drawnNumbers.clear();
        drawnNumberElement.textContent = ":המספר שהוגרל";
        messageElement.textContent = "";
        failClicks = 0;
        gameOver = false;
        generateBoard();
    }

    generateBoard();
    drawButton.addEventListener("click", drawNumber);
    resetButton.addEventListener("click", resetGame);
});