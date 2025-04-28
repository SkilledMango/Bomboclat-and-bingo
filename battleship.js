import {createGrid, getShipCounts, validateShipSetup, placeShipsOnGrid} from './function.js';
const gridOptions = document.querySelectorAll('input[name="grid-size"]');
const gameGrid = document.querySelector('.game-grid');
const startButton = document.querySelector('#start-game');
const gameBoards = document.querySelector('.game-boards');

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
    } else {
        alert('Invalid ship setup! Please check your ship counts.');
    }
});
