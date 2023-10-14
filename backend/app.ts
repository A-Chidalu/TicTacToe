import express, { Request, Response } from 'express';
import path from 'path';
import roomRouter from './routes/rooms';

// Create an Express application
const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/room', roomRouter);

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/html/homepage.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

