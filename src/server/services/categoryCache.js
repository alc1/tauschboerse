'use strict'

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');
const dbCategories = dataFiles.dbCategories;

class CategoryCache {
    constructor() {
        this.categories = [];
    }

    init() {
        return new Promise((resolve, reject) => {
            console.log('Loading categories...');
            dbCategories.find({}, (err, recs) => {
                console.log('categories loaded');
                this.categories = recs;
                resolve(this);
            });
        });
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }
}

module.exports = {
    CategoryCache
};
