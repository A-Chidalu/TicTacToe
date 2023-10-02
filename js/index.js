let board  = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let currentPlayer;
let isGameOver = false;

const resetBoard = () => {
    //wipe board
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]

    //wipe board in dom
    const gridItems = getGridSquares();

    for(let i = 0; i < gridItems.length; i++) {
        const cell = gridItems[i];
        cell.textContent = ''
    }

    //hide reset button
    hideResetArea();

    //Set isGameOver = false
    isGameOver = false;


}

const unHideResetArea = () => {
    const resetArea = document.getElementById('resetArea');
    resetArea.style.display = 'flex';
}

const hideResetArea = () => {
    const resetArea = document.getElementById('resetArea');
    resetArea.style.display = 'none';
}

const getGridSquares = () => {
    return document.getElementsByClassName('grid-square');
}

const checkForWin = () => {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                return true;
            }
        }
    
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] !== '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                return true;
            }
        }
    
        // Check diagonals
        if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return true;
        }
        if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return true;
        }
    
        return false; // No win
}

const checkForDraw = () => {
    // Check if the board is full
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                return false; // There's an empty cell, the game can continue
            }
        }
    }

    // Check if there's a win, and if not, it's a draw
    if (!checkForWin()) {
        return true; // No empty cells and no win, it's a draw
    }

    return false; // The game is still ongoing
}



function init() {
    const gridItems = getGridSquares();

    currentPlayer = 'X';

    for(let i = 0; i < gridItems.length; i++) {
        const cell = gridItems[i];
        
        cell.addEventListener("click", (e) => {
            const row = Math.floor(i / 3);
            const col = i % 3;

            if(!isGameOver) {
                if (!cell.textContent && board[row][col] === '') {
                    cell.textContent = currentPlayer;
                    board[row][col] = currentPlayer;

                    setTimeout(() => {
                        // After each move, you can check for a win or a draw and update the game state accordingly.
                        if (checkForWin()) {
                            alert(`Player ${currentPlayer} wins! Please restart the game.`);
                            isGameOver = true;
                            unHideResetArea();
                        } else if (checkForDraw()) {
                            alert('You have drawed. Please restart the game.')
                            isGameOver = true;
                            unHideResetArea();
                        }
                        
                        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

                    }, 100);
                    

                    
                }
            }
            

        });
    }
    
}

init();