const socket = io();
const urlParams = new URLSearchParams(window.location.search);

const initMessage = {
    method: "joinRoom",
    roomId: urlParams.get("roomId"),
    playerId: urlParams.get("playerId"),
    playerLetter: urlParams.get("playerLetter") 
}

socket.emit('message', JSON.stringify(initMessage));