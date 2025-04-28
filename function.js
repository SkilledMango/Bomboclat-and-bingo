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

export function placeShipsOnGrid(ships, gridSize, gameGrid) {
    const occupiedCells = new Set();

    ships.forEach(ship => {
        for (let i = 0; i < ship.count; i++) {
            let placed = false;

            while (!placed) {
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                const shipCells = [];
                for (let j = 0; j < ship.size; j++) {
                    const row = direction === 'horizontal' ? startRow : startRow + j;
                    const col = direction === 'horizontal' ? startCol + j : startCol;

                    if (row >= gridSize || col >= gridSize || occupiedCells.has(`${row},${col}`)) {
                        break;
                    }

                    shipCells.push(`${row},${col}`);
                }

                if (shipCells.length === ship.size) {
                    shipCells.forEach(cell => occupiedCells.add(cell));
                    placed = true;

                    shipCells.forEach(cell => {
                        const [row, col] = cell.split(',').map(Number);
                        const cellIndex = row * gridSize + col;
                        gameGrid.children[cellIndex].classList.add('ship');
                    });
                }
            }
        }
    });
}