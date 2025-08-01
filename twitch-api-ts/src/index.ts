// IMPORTS
import express from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
const app = express().disable('X-Powered-By');

app.use(express.json());
app.use(cookieParser());

// ENVIRONMENT VARIABLES
import dotenv from 'dotenv';
dotenv.config();
const host = process.env.TWITCH_API_HOST;
if (!host) throw new Error('Missing TWITCH_API_HOST.');
const port = process.env.TWITCH_API_PORT;
if (!port) throw new Error('Missing TWITCH_API_PORT.');

// CORS CONFIG
const whitelist = ['https://savidgeapps.com', 'http://localhost:5173'];
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (process.env.ENVIRONMENT === 'dev') callback(null, true);
        else if (!origin || whitelist.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// CUSTOM MIDDLEWARE
import { logger } from './middleware/logEvents';
app.use(logger);
import { errorHandler } from './middleware/errorHandler';

// SERVICE STATE MANAGEMENT
import { initializeServiceState } from './utils/serviceStateManager';
initializeServiceState();

// ROUTES
import tokenRoute from './routes/token';
app.use('/token', tokenRoute);
import channelRoute from './routes/channel';
app.use('/channel', channelRoute);
import statusRoute from './routes/status';
app.use('/status', statusRoute);

// ERROR HANDLER
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
});