interface RoomResponse {
    roomId: string;
    playerId: string;
    playerLetter: string;
}

interface AnnouncementResponse {
    roomId: string,
    message: string
}

interface MoveMadeResponse {
    roomId: string,
    board: string[][],
    currentPlayerTurn: string
}