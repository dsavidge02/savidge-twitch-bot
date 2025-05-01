const express = require('express');
const app = express().disable('X-Powered-By');
app.use(express.json());

// READING IN ENV VARIABLES
require('dotenv').config();
const port = process.env.ENVIRONMENT === 'DEV' ? 3001 : process.env.PORT;
const url = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.URL;

// LOADING IN CUSTOM ROUTES
const twitchRouter = require('./routes/twitch');
app.use('/twitch', twitchRouter);

const statsLeetcodeRouter = require('./routes/stats/leetcode');
app.use('/stats', statsLeetcodeRouter);

// READING IN AND USING index.html
const path = require('path');
const apiHomePage = path.join(__dirname, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(apiHomePage);
});

app.listen(port, () => {
    console.log(`Server is running on ${url}:${port}`);
});