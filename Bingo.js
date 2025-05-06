document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 5; // 5x5 Bingo board
    const maxNumber = 75; // Numbers range from 1 to 75
    const bingoBoard = document.getElementById("bingo-board");
    const drawButton = document.getElementById("draw-button");
    const drawnNumberElement = document.getElementById("drawn-number");
    const messageElement = document.getElementById("message");

    let drawnNumbers = new Set();
    let boardNumbers = [];

    // Generate the Bingo board
    function generateBoard() {
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
                row.appendChild(cell);
                index++;
            }
            bingoBoard.appendChild(row);
        }
    }

    // Shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Draw a random number
    function drawNumber() {
        if (drawnNumbers.size >= maxNumber) {
            messageElement.textContent = "כל המספרים כבר הוגרלו!";
            return;
        }

        let number;
        do {
            number = Math.floor(Math.random() * maxNumber) + 1;
        } while (drawnNumbers.has(number));

        drawnNumbers.add(number);
        drawnNumberElement.textContent = `המספר שהוגרל: ${number}`;
        highlightNumber(number);
    }

    // Highlight the drawn number on the board
    function highlightNumber(number) {
        const cells = bingoBoard.querySelectorAll("td");
        cells.forEach(cell => {
            if (parseInt(cell.dataset.number) === number) {
                cell.classList.add("marked");
            }
        });
    }

    // Initialize the game
    generateBoard();
    drawButton.addEventListener("click", drawNumber);
});