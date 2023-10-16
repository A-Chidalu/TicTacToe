interface WebSocketMessage {
    method: string
}

interface JoinRoomMessage extends WebSocketMessage {
    roomId: string, 
    playerId: string, 
    playerLetter: string
}

interface PlayerMoveMessage extends WebSocketMessage {
    moveLocation: number[],
    roomId: string, 
    playerId: string, 
    playerLetter: string
}