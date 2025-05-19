import {createGrid, getShipCounts, validateShipSetup, placeShipsOnGrid, handleCellClick, resetLives} from './function.js';

const gridOptions = document.querySelectorAll('input[name="grid-size"]');
const shipInputs = document.querySelectorAll('.ship-input input');
const gameGrid = document.querySelector('.game-grid');
const startButton = document.querySelector('#start-game');
const resetButton = document.querySelector('#reset-game');
const gameBoards = document.querySelector('.game-boards');
const shipStatusTable = document.querySelector('.ship-status table');

function updateShipStatus(shipSize) {
    if (!shipSize) return;
    

    const rowIndex = 5 - shipSize;
    const countCell = shipStatusTable.rows[rowIndex].cells[1];
    const currentCount = parseInt(countCell.textContent);
    if (currentCount > 0) {
        countCell.textContent = currentCount - 1;
    }
}

function resetShipStatus() {
    const ships = getShipCounts();
    ships.forEach((ship, index) => {
        shipStatusTable.rows[index].cells[1].textContent = ship.count;
    });
}

function disableGameSetup() {
    gridOptions.forEach(radio => radio.disabled = true);
    
    shipInputs.forEach(input => input.disabled = true);
    
    startButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
}

function enableGameSetup() {
    gridOptions.forEach(radio => radio.disabled = false);
    
    shipInputs.forEach(input => input.disabled = false);
    
    startButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    
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
        createGrid(gridSize, gameGrid); 
        placeShipsOnGrid(ships, gridSize, gameGrid);
        gameBoards.classList.add('show'); // Show the game boards
        resetShipStatus();
        disableGameSetup(); 

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
    resetLives(); // Reset lives when game is reset
});
