'use strict'

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');
const dbCategories = dataFiles.dbCategories;

class CategoryCache {
    constructor() {
        this.categories = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading categories...');
            dbCategories.find({}, (function(err, recs) {
                console.log('categories loaded');
                this.categories = recs;
                resolve(this);
            }).bind(this));
        }).bind(this);
                    
        return new Promise(load);
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }
}

module.exports = {
    CategoryCache
};
