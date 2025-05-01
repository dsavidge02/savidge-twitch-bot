const express = require('express');
const app = express().disable('X-Powered-By');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

// READING IN ENV VARIABLES
require('dotenv').config();
const port = process.env.ENVIRONMENT === 'DEV' ? 3002 : process.env.PORT;
const url = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.URL;

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);
const refreshRouter = require('./routes/refresh');
app.use('/refresh', refreshRouter);
const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter);
const validateRouter = require('./routes/validate');
app.use('/validate', validateRouter);

app.listen(port, () => {
    console.log(`Server is running on ${url}:${port}`);
});