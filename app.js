import express from 'express';
import path from 'path';
import userRoutes from './routes/userRoutes.js';

const app = express();

const dirname = path.resolve(); // Get the directory name of the current file

app.use(express.static(path.join(dirname, 'public'))); // Serve static files from the 'public' directory

app.use('/api/v1/users', userRoutes);




export default app;