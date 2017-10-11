'use strict';

const categoriesStore = require('../services/categoriesStorage');

async function getAllCategories(req, res) {
    const categories = await categoriesStore.getAllCategories();
    res.json({ categories : categories || [] });
}

async function getCategory(req, res) {
    const { categoryId } = req.params;
    const category = await categoriesStore.getCategory(categoryId);
    res.json({ category : category || {} });
}

module.exports = {
    getAllCategories,
    getCategory
};
