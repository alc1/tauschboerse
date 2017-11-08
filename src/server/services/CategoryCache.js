'use strict';

const Category = require('../../shared/businessobjects/Category');
const db = require('./dataFiles').datafiles.dbCategories;

class CategoryCache {
    constructor() {
        this.categories = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading categories...');
            db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading categories');
                    reject(err);
                } else {
                    console.log('categories loaded');
                    this.categories = recs.map(r => this.toLogicalRecord(r));
                    resolve(this);
                }
            }).bind(this));
        };
                    
        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = function(resolve, reject) {
            console.log('Clearing categories...');
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing categories: ' + err);
                    reject(err);
                } else {
                    console.log('Categories have been cleared');
                    this.categories = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        };

        let compactOp = function(resolve, reject) {
            console.log('Compacting categories datafile...');
            db.once('compaction.done', () => {
                console.log('Categories datafile compacted');
                resolve(null);
            });
            db.persistence.compactDatafile();
        };

        return new Promise(clearOp.bind(this)).then(() => new Promise(compactOp));
    }

    save(category) {
        let rec;
        let saveOp;

        if (category.hasOwnProperty('_id')) {
            rec = this.find(category._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                db.insert(CategoryCache.toPhysicalRecord(category), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newCategory = this.toLogicalRecord(newRec);
                        this.categories.push(newCategory);
                        category._id = newCategory._id;
                        resolve(newCategory);
                    }
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(category)) {
                    db.update({_id: rec._id}, CategoryCache.toPhysicalRecord(rec), function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    delete(id) {
        deleteOp = function(resolve, reject) {
            let category = this.find(id);
            if (category) {
                this.categories.remove(category);
                db.remove({ _id: category._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }
        
        return new Promise(deleteOp.bind(this));
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }

    findAll() {
        return this.categories.slice();
    }

    prepare(obj) {
        let category = new Category(obj);

        return category;
    }

    static toPhysicalRecord(category) {
        let rec = {};

        if (category.hasOwnProperty('_id')) {
            rec._id = category._id;
        }

        rec.name = category.name;

        return rec;
    }

    toLogicalRecord(rec) {
        let category = new Category(null);
        category._id = rec._id;
        category.name = rec.name;

        return category;
    }
}

module.exports = {
    CategoryCache
};
