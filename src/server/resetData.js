const path = require('path');
const env = require('node-env-file');
const initDataCache = require('./services/DataCache').initDataCache;

env(path.join(__dirname, 'config.env'));

const isProd = (process.argv.length > 2) && (process.argv[2].toLowerCase() === 'prod');
const webroot = path.join(__dirname, isProd ? process.env.WEBROOT_PROD : process.env.WEBROOT);

initDataCache(true, webroot)
.then(() => {
    console.log('Data reset');
})
.catch((err) => {
    console.log('Error resetting data: ' + err);
});
