require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
const PORT = 5000;

mongoose.connect(db.url);
const dbConn = mongoose.connection;

dbConn.once('open', () => {
    console.log('DB is connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

app.get('/', (req, res) => {
    res.json({ messge: 'Welcome to Note API'})
});

//add routes here
require('./app/routes/user')(app);
require('./app/routes/note')(app);

app.listen(process.env.PORT || PORT, () => {
    console.log(`App is listening to PORT ${PORT}`);
});
