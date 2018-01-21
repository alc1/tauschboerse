'use strict';

const dataCache = require('../services/DataCache').dataCache;

function getAllCategories(req, res) {
    const categories = dataCache.getCategories();
    res.json({ categories : categories || [] });
}

module.exports = {
    getAllCategories
};
