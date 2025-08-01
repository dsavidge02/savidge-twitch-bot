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
const host = process.env.AUTH_SERVICE_HOST;
if (!host) throw new Error('Missing AUTH_SERVICE_HOST.');
const port = process.env.AUTH_SERVICE_PORT;
if (!port) throw new Error('Missing AUTH_SERVICE_PORT.');
const mongoURI = process.env.AUTH_SERVICE_MONGO_URI;
if (!mongoURI) throw new Error('Missing AUTH_SERVICE_MONGO_URI.');

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

// CUSTOM IMPORTS
// UNPROTECTED ROUTES
import loginRoute from './routes/login';
app.use('/login', loginRoute);
import logoutRoute from './routes/logout';
app.use('/logout', logoutRoute);
import refreshTokenRoute from './routes/refreshToken';
app.use('/refresh', refreshTokenRoute);
import registerRoute from './routes/register';
app.use('/register', registerRoute);
// PROTECTED ROUTES
import userRoute from './routes/protected/user';
app.use('/user', userRoute);
import usersRoute from './routes/protected/users';
app.use('/users', usersRoute);

app.use(errorHandler);

import { mongoConnector } from '@dsavidge02/mongo-connector-ts';

let server;

mongoConnector.connect(mongoURI)
    .then(() => {
        mongoConnector.setDB("auth")
        server = app.listen(port, () => {
            console.log(`Server is running on ${host}:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });