export function createGrid(size, gameGrid)  // function to create grid size
{
gameGrid.innerHTML = ''; // Clear the grid before creating a new one
gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
for(let i = 0; i < size * size; i++) 
{
const cell = document.createElement('div');
cell.classList.add('grid-cell');
cell.dataset.index = i; // Store the index in the dataset for easy access
gameGrid.appendChild(cell);
}
}
export function getShipCounts() 
{
const shipSizes = [2,3,4,5]; //ship sizes
const shipInputs = document.querySelectorAll('.ship-input input');
const ships = [];
shipInputs.forEach((input,index) => {
    console.log(`index: ${index}, value: ${input.value}`); // Debugging line to check index and value
    ships.push({
        size: shipSizes[index], 
        count: parseInt(input.value) // Number of ships entered;
    });
});
return ships;
}
export function validateShipSetup(ships, gridSize) {
    const totalShipCells = ships.reduce((total, ship) => {
     return total + (ship.size * ship.count); // Calculate total cells occupied by ships
    }, 0);
    const maxAllowedCells = Math.floor((gridSize * gridSize) / 2); // Maximum allowed cells for ships
    return totalShipCells <= maxAllowedCells; // Check if total ship cells exceed the allowed limit
}
export function placeShipsOnGrid(ships, gridSize, gameGrid) {
    const occupiedCells = new Set(); // Keep track of occupied cells to avoid overlaps

    ships.forEach(ship => {
        for (let i = 0; i < ship.count; i++) {
            let placed = false;

            while (!placed) {
                // Randomly choose a starting cell and direction
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                // Check if the ship fits
                const shipCells = [];
                for (let j = 0; j < ship.size; j++) {
                    const row = direction === 'horizontal' ? startRow : startRow + j;
                    const col = direction === 'horizontal' ? startCol + j : startCol;

                    // Check if the cell is within bounds and not already occupied
                    if (row >= gridSize || col >= gridSize || occupiedCells.has(`${row},${col}`)) {
                        break;
                    }

                    shipCells.push(`${row},${col}`);
                }

                // If the ship fits, mark the cells as occupied
                if (shipCells.length === ship.size) {
                    shipCells.forEach(cell => occupiedCells.add(cell));
                    placed = true;

                    // Mark the cells visually on the grid
                    shipCells.forEach(cell => {
                        const [row, col] = cell.split(',').map(Number);
                        const cellIndex = row * gridSize + col;
                        const gridCell = gameGrid.children[cellIndex];
                        gridCell.classList.add('ship'); // Add a class to visually mark the ship
                    });
                }
            }
        }
    });
}