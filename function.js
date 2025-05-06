export function createGrid(size, gameGrid) {
    gameGrid.innerHTML = '';
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        gameGrid.appendChild(cell);
    }
}

export function getShipCounts() {
    const shipSizes = [5, 4, 3, 2, 1]; // Order matches HTML: Aircraft Carrier(5), Battleship(4), Cruiser(3), Destroyer(2), Submarine(1)
    const shipInputs = document.querySelectorAll('.ship-input input');
    return Array.from(shipInputs).map((input, index) => ({
        size: shipSizes[index],
        count: parseInt(input.value)
    }));
}

export function validateShipSetup(ships, gridSize) {
    const totalShipCells = ships.reduce((total, ship) => total + (ship.size * ship.count), 0);
    const maxAllowedCells = Math.floor((gridSize * gridSize) / 2);
    return totalShipCells <= maxAllowedCells;
}

// Keep track of placed ships and their remaining hits
let ships = []; // Array of ship objects with their positions and hits
let remainingShips = new Map(); // Maps ship sizes to count of remaining ships
let maxLives = 15; // Default max lives
let currentLives = maxLives;

const difficultyLives = {
    easy: 15,
    medium: 12,
    hard: 8,
    extreme: 5
};

export function placeShipsOnGrid(shipCounts, gridSize, gameGrid) {
    // Set lives based on difficulty
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    maxLives = difficultyLives[selectedDifficulty];
    currentLives = maxLives;
    updateLivesDisplay();

    ships = [];
    remainingShips.clear();
    const occupiedCells = new Set();

    // Initialize remaining ships
    shipCounts.forEach(ship => {
        remainingShips.set(ship.size, ship.count);
    });

    let shipId = 0;
    shipCounts.forEach(shipCount => {
        for (let i = 0; i < shipCount.count; i++) {
            let placed = false;

            while (!placed) {
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                const shipCells = [];
                for (let j = 0; j < shipCount.size; j++) {
                    const row = direction === 'horizontal' ? startRow : startRow + j;
                    const col = direction === 'horizontal' ? startCol + j : startCol;

                    if (row >= gridSize || col >= gridSize || occupiedCells.has(`${row},${col}`)) {
                        break;
                    }

                    shipCells.push(`${row},${col}`);
                }

                if (shipCells.length === shipCount.size) {
                    // Create a new ship object
                    const ship = {
                        id: shipId++,
                        size: shipCount.size,
                        positions: shipCells,
                        hits: 0
                    };
                    ships.push(ship);

                    shipCells.forEach(cell => {
                        occupiedCells.add(cell);
                    });
                    placed = true;

                    shipCells.forEach(cell => {
                        const [row, col] = cell.split(',').map(Number);
                        const cellIndex = row * gridSize + col;
                        const gridCell = gameGrid.children[cellIndex];
                        gridCell.classList.add('ship');
                        gridCell.dataset.shipId = ship.id;
                    });
                }
            }
        }
    });

    return { ships, remainingShips };
}

function updateLivesDisplay() {
    const livesCount = document.getElementById('lives-count');
    const healthFill = document.querySelector('.health-fill');
    
    livesCount.textContent = currentLives;
    const healthPercent = (currentLives / maxLives) * 100;
    healthFill.style.width = `${healthPercent}%`;

    // Change health bar color based on remaining health
    if (healthPercent > 60) {
        healthFill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
    } else if (healthPercent > 30) {
        healthFill.style.background = 'linear-gradient(90deg, #ffc107, #ff9800)';
    } else {
        healthFill.style.background = 'linear-gradient(90deg, #ff4747, #ff0000)';
    }
}

function showGameOver() {
    const overlay = document.getElementById('gameover-overlay');
    const gameoverSound = document.getElementById('gameover-sound');
    overlay.classList.remove('hidden');
    gameoverSound.play();

    // Add click handler to close overlay
    overlay.onclick = () => {
        hideGameOver();
        const resetButton = document.getElementById('reset-game');
        if (resetButton) {
            resetButton.click();
        }
    };
}

function hideGameOver() {
    const overlay = document.getElementById('gameover-overlay');
    overlay.classList.add('hidden');
    // Remove click handler
    overlay.onclick = null;
}

export function resetGame() {
    hideGameOver();
    resetLives();
}

export function handleCellClick(cell, position) {
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        return null;
    }

    const shipId = cell.dataset.shipId;
    if (shipId !== undefined) {
        cell.classList.add('hit');
        const ship = ships.find(s => s.id === parseInt(shipId));
        ship.hits++;

        if (ship.hits === ship.size) {
            const remaining = remainingShips.get(ship.size);
            if (remaining > 0) {
                remainingShips.set(ship.size, remaining - 1);

                const explosionSound = document.getElementById('explosion-sound');
                explosionSound.currentTime = 0;
                explosionSound.play();

                document.querySelectorAll(`.grid-cell[data-ship-id="${shipId}"]`).forEach(shipCell => {
                    shipCell.classList.add('ship-destroyed');
                });

                return ship.size;
            }
        }
        return null;
    } else {
        cell.classList.add('miss');
        currentLives--;
        updateLivesDisplay();

        if (currentLives <= 0) {
            showGameOver();
        }
        return null;
    }
}

// Add this to your exports
export function resetLives() {
    currentLives = maxLives;
    updateLivesDisplay();
}

export function getRemainingShips() {
    return remainingShips;
}