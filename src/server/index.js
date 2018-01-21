'use strict';

const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const env = require('node-env-file');
const express = require('express');
const app = express();
const articlesRoutes = require('./routes/articlesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const tradesRoutes = require('./routes/tradesRoutes');
const initDataCache = require('./services/DataCache').initDataCache;

const isProd = (process.argv.length > 2) && (process.argv[2].toLowerCase() === 'prod');

function startServer(port) {
    console.log('Starting web server...');
    let server = http.createServer(app);
    server.listen(port, () => {
        console.log(`Exchange Application API Server is ready on http://localhost:${server.address().port}! Waiting for requests...`);
    });
}

env(path.join(__dirname, 'config.env'));

const port = process.env.PORT || (isProd ? process.env.PORT_PROD : process.env.PORT_DEV);
const webroot = path.join(__dirname, isProd ? process.env.WEBROOT_PROD : process.env.WEBROOT_DEV);
const indexHtml = path.join(webroot, '/index.html');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use('/', express.static(webroot));

app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/users', usersRoutes);

// catch-all: send back index.html for all requests that nake it this far
app.get('*', (request, response) => {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.sendFile(indexHtml);
});

initDataCache(false, webroot)
    .then(() => {
        console.log('Data Cache initialised');
        startServer(Number(port));
    })
    .catch((err) => {
        console.log('Error initialising cache: ' + err);
    });
