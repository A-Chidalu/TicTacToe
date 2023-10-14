import express from 'express';
import {RoomController} from '../controller/roomController';

const router = express.Router();

router.post('/create', RoomController.createRoom);

export default router;
