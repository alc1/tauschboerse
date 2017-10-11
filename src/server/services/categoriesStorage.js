'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/categories.db', autoload : true });

const storageUtils = require('../utils/storageUtils');

function insertTestData() {
    const categories = [
        {name: 'Möbel'},
        {name: 'Technik'},
        {name: 'Fussball'},
        {name: 'Sport'},
        {name: 'Kindersachen'}
    ];
    return new Promise((resolve, reject) => {
        db.insert(categories, (err, newDocs) => {
            storageUtils.handlePromiseResult(resolve, newDocs, reject, err);
        });
    });
}

function getAllCategories() {
    return new Promise((resolve, reject) => {
        db.find({}, (err, categories) => {
            storageUtils.handlePromiseResult(resolve, categories, reject, err);
        });
    });
}

function getCategories(theCategoryIds) {
    return new Promise((resolve, reject) => {
        db.find({ $where : function() { return (!!theCategoryIds && theCategoryIds.includes(this._id)) } }, (err, categories) => {
            storageUtils.handlePromiseResult(resolve, categories, reject, err);
        });
    });
}

function getCategory(theCategoryId) {
    return new Promise((resolve, reject) => {
        db.findOne({ _id : theCategoryId }, (err, category) => {
            storageUtils.handlePromiseResult(resolve, category, reject, err);
        });
    });
}

module.exports = {
    getAllCategories,
    getCategories,
    getCategory,
    insertTestData
};
