const express = require('express');
const session = require('express-session');
require('./config/database');
const authRoutes = require('./routes/userRouter')
const recordRoutes = require('./routes/recordRouter')


const PORT = 1010;
const app = express();

// Allows data to be passed through request body
app.use(express.json());

// Set up the session middleware
app.use(
    session({
        secret: process.env.SECRETE,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000, // 1 hour
        }
    })
);

app.use('/api', authRoutes)
app.use('/api', recordRoutes)

app.listen(PORT, () => {
    console.log(`Server is now listening to PORT: ${PORT}`);
});