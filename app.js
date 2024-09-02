import express from 'express';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './controllers/errorController.js';
import helmet from 'helmet';
import mongoSaniotize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

const app = express();

app.use(cors())

app.use(helmet({
    crossOriginResourcePolicy: false,
  }));


app.use(express.json({ limit: '170kb' }))
app.use('/public', express.static('public'));; // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true, limit: '170kb' }));

const limit = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
})

app.use(morgan('dev'));
app.use(mongoSaniotize())
app.use(xss())
app.use(hpp())

app.use(compression())


app.use('/api', limit);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);


// Global Error Handler
app.use(globalErrorHandler);

export default app;