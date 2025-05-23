// IMPORTS
const express = require('express');
const app = express().disable('X-Powered-By');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// IMPORTED MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// CUSTOM IMPORTS
const { mongoConnector } = require('./utils/mongo');

// READ IN THE CONFIG VALUES
require('dotenv').config();
const PORT = process.env.ENVIRONMENT === 'DEV' ? 4000 : process.env.PORT;
const URL = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.URL;

// CUSTOM MIDDLEWARE
const { logger } = require('./middleware/logEvents');
app.use(logger);
const { errorHandler } = require('./middleware/errorHandler');

// CORS
const whitelist = ['https://savidgeapps.com', 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.ENVIRONMENT === 'DEV' && !origin) {
            callback(null, true);
        }
        else if (whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/health', require('./routes/protected/health'));
app.use('/resetPassword', require('./routes/protected/resetPassword'));
app.use('/updateRoles', require('./routes/protected/updateRoles'));
app.use('/deleteUser', require('./routes/protected/deleteUser'));
app.use('/users', require('./routes/protected/users'));

app.use(errorHandler);

let server;

mongoConnector.connect()
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`Server is running on ${URL}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });


const shutdown = async (signal) => {
    console.log(`${signal} received: shutting down gracefully...`);

    if (server) {
        console.log('Closing HTTP server...');
        server.close(async (err) => {
            if (err) {
                console.error('Error closing HTTP server:', err);
                process.exit(1);
            }
            console.log('HTTP server closed.');
            await mongoConnector.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    } else {
        await mongoConnector.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('UncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UnhandledRejection');
});
