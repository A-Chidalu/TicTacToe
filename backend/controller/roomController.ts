import { Request, Response } from 'express';
import shortid from 'shortid';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { GameCheckUtil } from '../util/GameCheckUtil';


//Use an in-memory object for now. Not best practice but YOLO
const rooms: { [key: string]: RoomResponse[] } = {}
const roomBoard: { [key: string]: { board: string[][]; currentPlayerTurn: string } } = {};

const createRoom = (req: Request, res: Response) => {
    const roomId: string = shortid.generate();
    const playerId: string = shortid.generate();
    const createRoomResponse: RoomResponse = {
        roomId,
        playerId,
        playerLetter: 'X'
    };

    rooms[roomId] = [createRoomResponse];
    roomBoard[roomId] = {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentPlayerTurn: 'X'
    };

    console.log(`[createRoom()] Creating room ${roomId} with createRoomResponse ${JSON.stringify(createRoomResponse)}`);

    res.status(201).json(createRoomResponse);
};

const getPlayerLetterForRoom = (roomId: string): string => {
    if (!(roomId in rooms)) {
        throw new Error(`Room with id: ${roomId} does not exist.`);
    }

    if (rooms[roomId].length == 0) {
        return "X";
    }
    else {
        return "O";
    }
}

const joinRoom = (req: Request, res: Response) => {
    const roomId: string | undefined = req.params.roomId as string;
    console.log(`[joinRoom()] A User is attempting to join room ${roomId}. The current state of the room is ${JSON.stringify(rooms[roomId])}`)
    if (roomId && roomId in rooms && rooms[roomId].length < 2) {
        const playerId: string = shortid.generate();
        const playerLetter: string = getPlayerLetterForRoom(roomId);

        const joinRoomResponse: RoomResponse = {
            roomId,
            playerId,
            playerLetter
        };

        res.status(200).json(joinRoomResponse);
    }
    else if (roomId && !(roomId in rooms)) {
        const errorMessage: ErrorMessage = {
            error: `RoomId ${roomId} is invalid.`
        }

        res.status(400).send(JSON.stringify(errorMessage));
    }
    else if (roomId && rooms[roomId].length >= 2) {
        const errorMessage: ErrorMessage = {
            error: `RoomId ${roomId} is already full.`
        }

        res.status(400).send(JSON.stringify(errorMessage));
    }
    else {
        const errorMessage: ErrorMessage = {
            error: `An unexpected error has occured.`
        }

        res.status(500).send(JSON.stringify(errorMessage));
    }
};

const getRoomHtml = (req: Request, res: Response) => {
    const roomId: string | undefined = req.params.roomId;

    if (roomId && roomId in rooms) {
        res.sendFile(path.join(__dirname, '../../../frontend/html/index.html'));
    }

    else {
        const errorMessage: ErrorMessage = {
            error: `RoomId ${roomId} is invalid.`
        }

        res.status(400).send(JSON.stringify(errorMessage));
    }
}

const isValidJoinRoomMessage = (joinRoomMessage: JoinRoomMessage): Boolean => {
    //TODO: Implement this later
    return true;
}

const handleJoinRoomWebSocketMessage = (joinRoomMessage: JoinRoomMessage, socket: Socket) => {
    if (isValidJoinRoomMessage(joinRoomMessage)) {
        console.log(`[handleJoinRoomWebSocketMessage()] Player ${joinRoomMessage.playerId} has joined room ${joinRoomMessage.roomId} as letter ${joinRoomMessage.playerLetter}`)
        socket.join(joinRoomMessage.roomId);

        const announcementResponse: AnnouncementResponse = {
            roomId: joinRoomMessage.roomId,
            message: `Player ${joinRoomMessage.playerId} has joined room ${joinRoomMessage.roomId} as letter ${joinRoomMessage.playerLetter}`
        }

        socket.to(joinRoomMessage.roomId).emit('message', JSON.stringify(announcementResponse));
    }
}

/*
A Move is valid iff:
1. The Game is not over (check the board)
2. This move is made by the correct player
*/
const isValidPlayerMove = (playerMove: PlayerMoveMessage): Boolean => {
    const { board, currentPlayerTurn } = roomBoard[playerMove.roomId];
    const moveLocation: number[] = playerMove.moveLocation;


    //If game is not over and the move is made by the player whos turn it currently is, and the location of the move is empty then the move IS valid
    if (!GameCheckUtil.isGameOver(board) && currentPlayerTurn === playerMove.playerLetter && !(board[moveLocation[0]][moveLocation[1]])) {
        return true;
    }
    else {
        return false;
    }


}

const handlePlayerMoveWebSocketMessage = (playerMoveMessage: PlayerMoveMessage, socket: Socket, io: Server) => {
    const { roomId, playerLetter } = playerMoveMessage;
    if (isValidPlayerMove(playerMoveMessage)) {
        console.log(`[handlePlayerMoveWebSocketMessage()] The move ${JSON.stringify(playerMoveMessage)} is valid!`);
        const moveLocation: number[] = playerMoveMessage.moveLocation;

        //Make the move on the boards room
        roomBoard[roomId].board[moveLocation[0]][moveLocation[1]] = playerLetter;

        //Change the currentPlayer Turn 
        roomBoard[roomId].currentPlayerTurn = roomBoard[roomId].currentPlayerTurn === 'X' ? 'O' : 'X';

        //Emit the response back to the players
        const moveMadeResponse: MoveMadeResponse = {
            roomId,
            board: roomBoard[roomId].board,
            currentPlayerTurn: roomBoard[roomId].currentPlayerTurn
        }

        io.to(roomId).emit('boardChange', JSON.stringify(moveMadeResponse));


    }
}

const handleWebSocketMessageRecieved = (message: string, socket: Socket, io: Server) => {
    try {
        console.log(`[handleWebSocketMessageRecieved()] A new web socket message was recieved by the server. The message: ${message}`)
        const webSocketMessage: WebSocketMessage = JSON.parse(message);


        if (webSocketMessage.method === "joinRoom") {
            handleJoinRoomWebSocketMessage((webSocketMessage as JoinRoomMessage), socket)
        }
        else if (webSocketMessage.method === "playerMove") {
            handlePlayerMoveWebSocketMessage((webSocketMessage as PlayerMoveMessage), socket, io)
        }

    } catch (err) {
        console.log("Error when handling web socket message: " + err);
    }
};

const connectToRoomSocket = (io: Server) => (socket: Socket) => {
    console.log('[connectToRoomSocket()] New WebSocket connection opened');

    // Handle incoming messages from the client
    socket.on('message', (message) => {
        handleWebSocketMessageRecieved(message, socket, io);
    });

    // Handle connection close
    socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
    });
}




export const RoomController = {
    createRoom,
    joinRoom,
    connectToRoomSocket,
    getRoomHtml
}




