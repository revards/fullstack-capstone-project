require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");


const app = express();
app.use("*", cors());
const port = 3060;

connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

app.use('/api/search', searchRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server")
})

app.use(express.static(path.join(__dirname, '../giftwebsite')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../giftwebsite', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

