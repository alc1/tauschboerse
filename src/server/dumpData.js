const initDataCache = require('./services/DataCache').initDataCache;
const dataCache = require('./services/DataCache').dataCache;

initDataCache(false)
    .then(() => {
        console.log('Data Cache initialised');
        dataCache.dump();
    })
    .catch((err) => {
        console.log('Error initialising cache: ' + err);
    });
