'use strict'

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/categories.db', autoload : true });

export class CategoryCache {
    constructor() {
        this.categories = [];
    }

    init() {
        return new Promise((resolve, reject) => {
            db.find({}, (err, recs) => {
                this.categories = recs;
            });
            resolve(this);
        });
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }
}