// IMPORTS
const express = require('express');
const app = express().disable('X-Powered-By');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// IMPORTED MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// READ IN THE CONFIG VALUES
require('dotenv').config();
const PORT = process.env.ENVIRONMENT === 'DEV' ? 3000 : process.env.PORT;
const URL = process.env.ENVIRONMENT === 'DEV' ? 'http://localhost' : process.env.PORT;

// CUSTOM MIDDLEWARE
const { logger } = require('./middleware/logEvents');
app.use(logger);
const { errorHandler } = require('./middleware/errorHandler');

// CORS
const whitelist = ['https://savidgeapps.com', 'http://localhost:3000'];
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
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/register', require('./routes/register'));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on ${URL}:${PORT}`);
});