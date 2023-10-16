import express, { Request, Response } from 'express';
import path from 'path';
import roomRouter from './routes/rooms';
import http from 'http';
import {Server} from 'socket.io';
import { RoomController } from './controller/roomController';

// Create an Express application
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
//Middleware to server static files
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/room', roomRouter);

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/html/homepage.html'));
});

//HANDLE WEB SOCKET STUFF

io.on('connection', RoomController.connectToRoomSocket(io));


// Start the Express server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


