'use strict';

const dataCache = require('../services/DataCache').dataCache;

function getAllCategories(req, res) {
    const categories = dataCache.getCategories();
    res.json({ categories : categories || [] });
}

function getCategory(req, res) {
    const { categoryId } = req.params;
    const category = dataCache.getCategory(categoryId);
    res.json({ category : category || null });
}

function addCategory(req, res) {
    var category = dataCache.prepareCategory(req.body);
    res.json({ category: null });
}

function updateCategory(req, res) {
    var category = dataCache.prepareCategory(req.body);
    res.json({ category: null });
}

function deleteCategory(req, res) {
    const { categoryId } = req.params;
    dataCache.deleteCategory(categoryId)
        .then(() => {
            res.json({ category: null });
        })
        .catch(err => {
            
        });
}

module.exports = {
    getAllCategories,
    getCategory
};
