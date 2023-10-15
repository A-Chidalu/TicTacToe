import { Request, Response } from 'express';
import shortid from 'shortid';
import path from 'path';
import { Socket } from 'socket.io';


//Use an in-memory object for now. Not best practice but YOLO
const rooms: {[key: string]: RoomResponse[]} = {}

const createRoom = (req: Request, res: Response) => {
    const roomId: string = shortid.generate();
    const playerId: string = shortid.generate();
    const createRoomResponse: RoomResponse = {
        roomId,
        playerId,
        playerLetter: 'X'
    };
    
    rooms[roomId] = [createRoomResponse];

    console.log(`Creating room ${roomId} with createRoomResponse ${JSON.stringify(createRoomResponse)}`);

    res.status(201).json(createRoomResponse);
};

const getPlayerLetterForRoom = (roomId: string): string => {
    if(!(roomId in rooms)) {
        throw new Error(`Room with id: ${roomId} does not exist.`);
    }

    if(rooms[roomId].length == 0) {
        return "X";
    }
    else {
        return "O";
    }
}

const joinRoom = (req: Request, res: Response) => {
    const roomId: string | undefined = req.params.roomId as string;
    console.log(`A User is attempting to join room ${roomId}. The current state of the room is ${JSON.stringify(rooms[roomId])}`)
    if(roomId && roomId in rooms && rooms[roomId].length < 2) {
        const playerId: string = shortid.generate();
        const playerLetter: string = getPlayerLetterForRoom(roomId);

        const joinRoomResponse: RoomResponse = {
            roomId,
            playerId,
            playerLetter
        };

        res.status(200).json(joinRoomResponse);
    }
    else if(roomId && !(roomId in rooms)) {
        const errorMessage: ErrorMessage = {
            error: `RoomId ${roomId} is invalid.`
        }

        res.status(400).send(JSON.stringify(errorMessage));
    }
    else if(roomId && rooms[roomId].length >= 2) {
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

    if(roomId && roomId in rooms) {
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
    if(isValidJoinRoomMessage(joinRoomMessage)) {
        console.log(`Player ${joinRoomMessage.playerId} has joined room ${joinRoomMessage.roomId} as letter ${joinRoomMessage.playerLetter}`)
        socket.join(joinRoomMessage.roomId);
    }
}

const handleWebSocketMessageRecieved = (message: string, socket: Socket) => {
    try {
        const webSocketMessage: WebSocketMessage = JSON.parse(message);
        
        if(webSocketMessage.method === "joinRoom") {
            handleJoinRoomWebSocketMessage((webSocketMessage as JoinRoomMessage), socket)
        }
    


    } catch(err) {
        console.log("Error when handling web socket message: " + err);
    }
};

const connectToRoomSocket = (socket: Socket) => {
    console.log('New WebSocket connection opened');

    // Handle incoming messages from the client
    socket.on('message', (message) => {
        handleWebSocketMessageRecieved(message, socket);
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




