'use strict';

const dataCache = require('../services/DataCache').dataCache;

function getAllCategories(req, res) {
    const categories = dataCache.getCategories();
    res.json({ categories : categories || [] });
}

function getCategory(req, res) {
    const { categoryId } = req.params;
    const category = dataCache.getCategory(categoryId);
    if (category) {
        res.json({ category });
    }
    else {
        res.status(404).json({ globalError: `Kategorie [${categoryId}] nicht gefunden` });
    }
}

module.exports = {
    getAllCategories,
    getCategory
};
