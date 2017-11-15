'use strict';

const categoriesStore = require('../services/categoriesStorage');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

async function getAllCategories(req, res) {
    if (useDataCache) {
        const categories = dataCache.getCategories();
        res.json({ categories : categories || [] });
    }
    else {
        const categories = await categoriesStore.getAllCategories();
        res.json({ categories : categories || [] });
    }
}

async function getCategory(req, res) {
    const { categoryId } = req.params;
    if (useDataCache) {
        const category = dataCache.getCategory(categoryId);
        res.json({ category : category || null });
    }
    else {
        const category = await categoriesStore.getCategory(categoryId);
        res.json({ category : category || null });
    }
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
