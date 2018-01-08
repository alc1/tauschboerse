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

async function createNewCategories(theArticle) {
    const existingCategories = theArticle.categories.filter(category => category.hasOwnProperty('_id'));
    const newCategories = theArticle.categories.filter(category => !category.hasOwnProperty('_id'));
    const allSaveRequests = newCategories.map(category => {
        const preparedCategory = dataCache.prepareCategory(category);
        return dataCache.saveCategory(preparedCategory);
    });
    const createdCategories = await Promise.all(allSaveRequests);
    theArticle.categories = [...existingCategories, ...createdCategories];
}

module.exports = {
    getAllCategories,
    getCategory,
    createNewCategories
};
