document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 5;
    const maxNumber = 75;
    const bingoBoard = document.getElementById("bingo-board");
    const drawButton = document.getElementById("draw-button");
    const resetButton = document.getElementById("reset-button");
    const drawnNumberElement = document.getElementById("drawn-number");
    const messageElement = document.getElementById("message");

    let drawnNumbers = new Set();
    let boardNumbers = [];

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
        if (drawnNumbers.size >= maxNumber) {
            messageElement.textContent = "All numbers have been drawn!";
            return;
        }

        let number;
        do {
            number = Math.floor(Math.random() * maxNumber) + 1;
        } while (drawnNumbers.has(number));

        drawnNumbers.add(number);
        drawnNumberElement.textContent = `Drawn number: ${number}`;
        highlightNumber(number);
        checkWinner();
    }

    function highlightNumber(number) {
        const cells = bingoBoard.querySelectorAll("td");
        cells.forEach(cell => {
            if (parseInt(cell.dataset.number) === number) {
                cell.classList.add("marked");
            }
        });
    }

    function checkWinner() {
        const rows = bingoBoard.querySelectorAll("tr");
        for (let i = 0; i < boardSize; i++) {
            const row = rows[i].querySelectorAll("td");
            if (Array.from(row).every(cell => cell.classList.contains("marked"))) {
                alert("You have a full row! You win!");
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
                alert("You have a full column! You win!");
                return;
            }
        }
    }

    function resetGame() {
        drawnNumbers.clear();
        drawnNumberElement.textContent = "Drawn number";
        messageElement.textContent = "";
        generateBoard();
    }

    generateBoard();
    drawButton.addEventListener("click", drawNumber);
    resetButton.addEventListener("click", resetGame);
});