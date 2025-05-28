const express = require('express');
const cors = require('cors');
const app = express().disable('X-Powered-By');

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// READING IN ENV VARIABLES
require('dotenv').config();
const port = process.env.ENVIRONMENT === 'DEV' ? 3001 : process.env.PORT;
const url = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.URL;

// STARTING TOKEN REFRESH LOOP
const { fetchAccessToken } = require('./utils/twitchAuthService');
fetchAccessToken();



// LOADING IN CUSTOM ROUTES
const userRouter = require('./routes/user');
app.use('/user', userRouter);

const channelRouter = require('./routes/channel');
app.use('/channel', channelRouter);

const accessTokenRouter = require('./routes/getUserToken');
app.use('/accessToken', accessTokenRouter);

app.use('/auth', require('./routes/auth'));

// READING IN AND USING index.html
const path = require('path');
const apiHomePage = path.join(__dirname, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(apiHomePage);
});

app.listen(port, () => {
    console.log(`Server is running on ${url}:${port}`);
});