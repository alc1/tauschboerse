'use strict'

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/categories.db', autoload : true });

export class CategoryCache {
    constructor() {
        this.categories = [];
    }

    init() {
        db.find({}, (err, recs) => {
            this.categories = recs;
        });
    }

    find(id) {
        return this.categories.find(cat => cat._id === id);
    }
}