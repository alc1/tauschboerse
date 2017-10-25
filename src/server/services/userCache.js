'use strict'

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const db = new Datastore({ filename : './data/users.db', autoload : true });

class UserCache {
    constructor() {
        this.users = [];
    }

    init() {
        return new Promise((resolve, reject) => {
            db.find({}, (err, recs) => {
                this.passwords = recs.map(user => { return { id: user._id, pwd: user.password}; });
                this.users = recs;
                this.users.forEach(user => {
                    delete user.password;
                });
                resolve(this);
            });
        });
    }

    find(id) {
        return this.users.find(user => user._id === id);
    }

    authenticate(id, pwd) {
        let rec = this.passwords.find(r => r.id === id);
        return rec ? bcrypt.compareSync(pwd, user.pwd) : false;
    }
}

module.exports = {
    UserCache
};
