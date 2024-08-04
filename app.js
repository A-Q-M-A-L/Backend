import express from 'express';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './controllers/errorController.js';
import helmet from 'helmet';
import mongoSaniotize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp';

const app = express();

app.use(helmet());
const dirname = path.resolve(); // Get the directory name of the current file

app.use(express.json({ limit: '10kb' }))
app.use(express.static(path.join(dirname, 'public'))); // Serve static files from the 'public' directory

const limit = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
})

app.use(mongoSaniotize())
app.use(xss())
app.use(hpp())

app.use('/api', limit);

app.use('/api/v1/users', userRoutes);


// Global Error Handler
app.use(globalErrorHandler);

export default app;