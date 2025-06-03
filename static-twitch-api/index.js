const express = require('express');
const http = require('http')
const app = express().disable('X-Powered-By');
const cors = require('cors');

// IMPORTED MIDDLEWARE

app.use(express.json());

// CORS
const whitelist = ['https://savidgeapps.com', 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.ENVIRONMENT === 'DEV') {
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

// READING IN ENV VARIABLES
require('dotenv').config();
const port = process.env.ENVIRONMENT === 'DEV' ? 3001 : process.env.PORT;
const url = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.URL;

// STARTING TOKEN REFRESH LOOP
const { fetchAccessToken } = require('./utils/twitchAuthService');
fetchAccessToken();

// LOADING IN CUSTOM ROUTES
app.use('/channel', require('./routes/channel'));
app.use('/auth', require('./routes/auth'));

// READING IN AND USING index.html
const path = require('path');
const apiHomePage = path.join(__dirname, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(apiHomePage);
});

const server = http.createServer(app);

const { createSocket } = require('./sockets/eventSocket');
createSocket(server);

server.listen(port, () => {
    console.log(`Server is running on ${url}:${port}`);
});