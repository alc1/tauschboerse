'use strict';

const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const routes = require('./routes/articlesRoutes');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './../../public')));
app.use(routes);

const server = http.createServer(app);
server.listen(3001, () => {
    console.log(`Exchange Application API Server is ready on http://localhost:${server.address().port}! Waiting for requests...`);
});
