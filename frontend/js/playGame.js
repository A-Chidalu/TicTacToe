const socket = io();


const urlParams = new URLSearchParams(window.location.search);

const roomId = urlParams.get("roomId");
const playerId = urlParams.get("playerId");
const playerLetter = urlParams.get("playerLetter"); 

const initMessage = {
    method: "joinRoom",
    roomId,
    playerId,
    playerLetter
}

socket.emit('message', JSON.stringify(initMessage));

const getGridSquares = () => {
    return document.getElementsByClassName('grid-square');
}

function initInfo() {
    const yourLetterSpan = document.getElementById('spanYourLetter');
    yourLetterSpan.textContent = playerLetter
}

function addBoardEventListeners() {
    const gridItems = getGridSquares();

    for(let i = 0; i < gridItems.length; i++) {
        const cell = gridItems[i];
        
        cell.addEventListener("click", (e) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            // console.log(`Cell [${row}, ${col}] was clicked!`);
            const moveLocation = [row, col];
            
            const moveMadeMessage = {
                method: "playerMove",
                moveLocation,
                roomId,
                playerId,
                playerLetter
            }

            socket.emit('message', JSON.stringify(moveMadeMessage));

        });
    }
    
}

addBoardEventListeners();
initInfo();

function updateBoard(board, currentPlayerTurn) {
    const gridItems = getGridSquares();
    const playerTurnSpan = document.getElementById('spanPlayerTurn');
    for(let i = 0; i < gridItems.length; i++) {
        const cell = gridItems[i];
        const row = Math.floor(i / 3);
        const col = i % 3;

        cell.textContent = board[row][col]
        playerTurnSpan.textContent = currentPlayerTurn
    }
}

socket.on("boardChange", (message) => {
    const boardChangeMessage = JSON.parse(message);
    const {board, currentPlayerTurn} = boardChangeMessage;

    updateBoard(board, currentPlayerTurn);

    console.log("Received message:", message);
});


  
