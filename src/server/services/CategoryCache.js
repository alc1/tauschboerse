'use strict';

const Category = require('../../shared/businessobjects/Category');

class CategoryCache {
    constructor(db) {
        this.db = db;
        this.categories = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading categories...');
            this.db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading categories');
                    reject(err);
                } else {
                    console.log('categories loaded');
                    this.categories = recs.map(rec => CategoryCache.toLogicalRecord(rec));
                    resolve(this);
                }
            }).bind(this));
        };
                    
        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = function(resolve, reject) {
            console.log('Clearing categories...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
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
            this.db.once('compaction.done', () => {
                console.log('Categories datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        };

        return new Promise(clearOp.bind(this)).then(() => new Promise(compactOp));
    }

    save(theCategory) {
        let foundLogicalCategory;
        let saveOp;

        if (theCategory.hasOwnProperty('_id')) {
            foundLogicalCategory = this.findById(theCategory._id);
        }

        if (!foundLogicalCategory) {
            saveOp = (function(resolve, reject) {
                this.db.insert(CategoryCache.toPhysicalRecord(theCategory), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newCategory = CategoryCache.toLogicalRecord(newRec);
                        this.categories.push(newCategory);
                        theCategory._id = newCategory._id;
                        resolve(newCategory);
                    }
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (foundLogicalCategory.update(theCategory)) {
                    this.db.update({_id: foundLogicalCategory._id}, CategoryCache.toPhysicalRecord(foundLogicalCategory), {}, function(err, newRec) {
                        resolve(foundLogicalCategory);
                    });
                } else {
                    resolve(foundLogicalCategory);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    deleteById(theCategoryId) {
        let deleteOp = function(resolve, reject) {
            let category = this.findById(theCategoryId);
            if (category) {
                this.categories.remove(category);
                this.db.remove({ _id: category._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        };

        return new Promise(deleteOp.bind(this));
    }

    findById(theCategoryId) {
        return this.categories.find(category => category._id === theCategoryId);
    }

    findByName(theCategoryName) {
        return this.categories.find(category => category.name === theCategoryName);
    }

    findAll() {
        return this.categories.slice();
    }

    prepare(obj) {
        let category = new Category(obj);
        if (obj.hasOwnProperty('_id')) {
            category._id = obj._id;
        }

        return category;
    }

    static toPhysicalRecord(theCategory) {
        let physicalRecord = {};

        if (theCategory.hasOwnProperty('_id')) {
            physicalRecord._id = theCategory._id;
        }

        physicalRecord.name = theCategory.name;

        return physicalRecord;
    }

    static toLogicalRecord(thePhysicalRecord) {
        let category = new Category(null);

        category._id = thePhysicalRecord._id;
        category.name = thePhysicalRecord.name;

        return category;
    }
}

module.exports = {
    CategoryCache
};
