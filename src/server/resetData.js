const path = require('path');
const env = require('node-env-file');
const initDataCache = require('./services/DataCache').initDataCache;

env(path.join(__dirname, 'config.env'));

initDataCache(true)
.then(() => {
    console.log('Data reset');
})
.catch((err) => {
    console.log('Error resetting data: ' + err);
});
