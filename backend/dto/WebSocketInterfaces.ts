interface WebSocketMessage {
    method: string
}

interface JoinRoomMessage extends WebSocketMessage {
    roomId: string, 
    playerId: string, 
    playerLetter: string
}