'use strict'

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const db = new Datastore({ filename : './data/users.db', autoload : true });

export class UserCache {
    constructor() {
        this.users = [];
    }

    init() {
        db.find({}, (err, recs) => {
            this.users = recs;
        });
    }

    find(id) {
        return this.users.find(user => user._id === id);
    }
}