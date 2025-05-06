import {createGrid, getShipCounts, validateShipSetup, placeShipsOnGrid, handleCellClick} from './function.js';

const gridOptions = document.querySelectorAll('input[name="grid-size"]');
const shipInputs = document.querySelectorAll('.ship-input input');
const gameGrid = document.querySelector('.game-grid');
const startButton = document.querySelector('#start-game');
const resetButton = document.querySelector('#reset-game');
const gameBoards = document.querySelector('.game-boards');
const shipStatusTable = document.querySelector('.ship-status table');

function updateShipStatus(shipSize) {
    if (!shipSize) return;
    
    // Find the corresponding table row (shipSize maps to the row index)
    // 5->0, 4->1, 3->2, 2->3, 1->4
    const rowIndex = 5 - shipSize;
    const countCell = shipStatusTable.rows[rowIndex].cells[1];
    const currentCount = parseInt(countCell.textContent);
    if (currentCount > 0) {
        countCell.textContent = currentCount - 1;
    }
}

function resetShipStatus() {
    // Reset counts to initial values from inputs
    const ships = getShipCounts();
    ships.forEach((ship, index) => {
        shipStatusTable.rows[index].cells[1].textContent = ship.count;
    });
}

function disableGameSetup() {
    // Disable grid size options
    gridOptions.forEach(radio => radio.disabled = true);
    
    // Disable ship count inputs
    shipInputs.forEach(input => input.disabled = true);
    
    // Hide start button and show reset button
    startButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
}

function enableGameSetup() {
    // Enable grid size options
    gridOptions.forEach(radio => radio.disabled = false);
    
    // Enable ship count inputs
    shipInputs.forEach(input => input.disabled = false);
    
    // Show start button and hide reset button
    startButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    
    // Hide the game board
    gameBoards.classList.remove('show');
}

gridOptions.forEach(button => {
    button.addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        createGrid(size, gameGrid);
    });
});

startButton.addEventListener('click', () => {
    const gridSize = parseInt(document.querySelector('input[name="grid-size"]:checked').value);
    const ships = getShipCounts();

    if (validateShipSetup(ships, gridSize)) {
        createGrid(gridSize, gameGrid); // Recreate grid with current size
        placeShipsOnGrid(ships, gridSize, gameGrid);
        gameBoards.classList.add('show'); // Show the game boards
        resetShipStatus(); // Reset the ship status display
        disableGameSetup(); // Disable controls after game starts

        // Add click handlers to grid cells
        const cells = gameGrid.children;
        Array.from(cells).forEach((cell, index) => {
            cell.addEventListener('click', () => {
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const position = `${row},${col}`;
                const hitShipSize = handleCellClick(cell, position);
                updateShipStatus(hitShipSize);
            });
        });
    } else {
        alert('Invalid ship setup! Please check your ship counts.');
    }
});

resetButton.addEventListener('click', () => {
    enableGameSetup();
    gameGrid.innerHTML = ''; // Clear the grid
    const defaultSize = 10;
    createGrid(defaultSize, gameGrid);
    document.querySelector('input[name="grid-size"][value="10"]').checked = true;
});
