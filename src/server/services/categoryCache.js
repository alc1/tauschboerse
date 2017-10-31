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

    clear() {
        return new Promise((function(resolve, reject) {
            this.dbCategories.remove({}, { multi: true }, (function(err, numRemoved) {
                this.categories = [];
                resolve(numRemoved);
            }).bind(this));
        }).bind(this));
    }

    save(category) {
        let rec;
        let saveOp;

        if (category.hasOwnProperty('_id')) {
            rec = this.find(category._id);
        }

        if (rec == null) {
            rec = new CategoryCache();
            saveOp = (function(resolve, reject) {
                this.dbCategories.insert(user, (function(err, newUser){
                    this.users.push(newUser);
                    resolve(newUser);
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(category)) {
                    this.dbCategories.update({_id: rec._id}, rec, function(err, newCategory) {
                        resolve(newCategory);
                    });
                } else {
                    resolve(0);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }

    findAll() {
        return this.categories.slice();
    }
}

module.exports = {
    CategoryCache
};
