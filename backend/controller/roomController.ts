import { Request, Response } from 'express';
import shortid from 'shortid';
import path from 'path';
import { Socket } from 'socket.io';


//Use an in-memory object for now. Not best practice but YOLO
const rooms: {[key: string]: CreateRoomResponse[]} = {}

const createRoom = (req: Request, res: Response) => {
    const roomId: string = shortid.generate();
    const playerId: string = shortid.generate();
    const createRoomResponse: CreateRoomResponse = {
        roomId,
        playerId,
        playerLetter: 'X'
    };
    
    rooms[roomId] = [createRoomResponse];

    console.log(`Creating room ${roomId} with createRoomResponse ${JSON.stringify(createRoomResponse)}`);

    res.status(201).json(createRoomResponse);
};

const joinRoom = (req: Request, res: Response) => {
    //TODO: Validate that the query parameters in the request are valid

    //for now just send them the right html page
    const roomId: string | undefined = req.query.roomId as string;

    if(roomId && roomId in rooms) {
        res.sendFile(path.join(__dirname, '../../../frontend/html/index.html'));
    }
    else {
        res.status(404).send(`Room ${roomId} not found.`);
    }


    
};

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
    connectToRoomSocket
}




