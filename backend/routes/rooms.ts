import express from 'express';
import {RoomController} from '../controller/roomController';

const router = express.Router();

router.post('/create', RoomController.createRoom);

router.get('/:id', RoomController.joinRoom);

export default router;
