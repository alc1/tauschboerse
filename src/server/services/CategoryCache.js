'use strict';

const Category = require('../model/Category');
const utils = require('../utils/modelUtils');

class CategoryCache {
    constructor(db) {
        this.db = db;
        this.categories = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading categories...');
            this.db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading categories');
                    reject(err);
                } else {
                    this.categories = recs.map(rec => CategoryCache.toLogicalRecord(rec));
                    console.log(`categories loaded: ${this.categories.length} entries`);
                    resolve(this);
                }
            }).bind(this));
        }).bind(this);
                    
        return new Promise(load);
    }

    clear() {
        let clearOp = (function(resolve, reject) {
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
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting categories datafile...');
            this.db.once('compaction.done', () => {
                console.log('Categories datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    dump() {
        console.log('Categories:')
        console.log(JSON.stringify(this.categories, null, 2));
        console.log('');
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
            }).bind(this);
        } else {
            saveOp = (function(resolve, reject) {
                if (foundLogicalCategory.update(theCategory)) {
                    this.db.update({_id: foundLogicalCategory._id}, CategoryCache.toPhysicalRecord(foundLogicalCategory), {}, function(err, newRec) {
                        resolve(foundLogicalCategory);
                    });
                } else {
                    resolve(foundLogicalCategory);
                }
            }).bind(this);
        }

        return new Promise(saveOp);
    }

    deleteById(theCategoryId) {
        let deleteOp = (function(resolve, reject) {
            let foundCategory = this.findById(theCategoryId);
            if (foundCategory) {
                this.categories = this.categories.filter(category => category._id !== theCategoryId);
                this.db.remove({ _id: theCategoryId }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }).bind(this);

        return new Promise(deleteOp);
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
        return new Category(obj);
    }

    static toPhysicalRecord(theCategory) {
        let physicalRecord = utils.transferId(theCategory, {});
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

module.exports = CategoryCache;
