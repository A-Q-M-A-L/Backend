import express from 'express';
import path from 'path';
const app = express();

const dirname = path.resolve(); // Get the directory name of the current file

app.use(express.static(path.join(dirname, 'public'))); // Serve static files from the 'public' directory






export default app;