import express from 'express';
import {RoomController} from '../controller/roomController';
import { Server } from 'socket.io';

const router = express.Router();

router.post('/create', RoomController.createRoom);

//When user uses the input field in the front end to join a room, they should make a post request
//Seems like a code smell to have two endpoints calling the same controller function but oh well

//TODO: Clean-up the fact that two endpoints and calling the same controller function
router.post('/join/:roomId', RoomController.joinRoom)

router.get('/:roomId', RoomController.getRoomHtml);

export default router;
