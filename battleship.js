import {createGrid , getShipCounts, validateShipSetup, placeShipsOnGrid} from './function.js';
const gridOptions =  document.querySelectorAll('input[name="grid-size"]');
const gameGrid = document.querySelector('.game-grid');
const startButton = document.querySelector('#start-game');
gridOptions.forEach(button => {
    button.addEventListener('change',(e) => {
        const size = parseInt(e.target.value);
        createGrid(size, gameGrid); // Call the function to create the grid with the selected size
    })
})
createGrid(10, gameGrid);
startButton.addEventListener('click', () => {
    const gridSize = parseInt(document.querySelector('input[name="grid-size"]:checked').value);
    const ships = getShipCounts(); // Get the ship counts from the input fields
    if (validateShipSetup(ships, gridSize)) {
        placeShipsOnGrid(ships, gridSize, gameGrid);
    } else {
        alert('Invalid ship setup! Please check your ship counts.');
    }
});
