import { Request, Response } from 'express';
import shortid from 'shortid';

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

export const RoomController = {
    createRoom
}




