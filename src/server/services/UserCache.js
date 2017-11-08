'use strict';

const User = require('../../shared/businessobjects/User');
const bcrypt = require('bcrypt');
const db = require('./dataFiles').dbUsers;

class UserCache {
    constructor() {
        this.users = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading users...');
            db.find({}, (function(err, recs) {
                this.passwords = recs.map(user => { return { id: user._id, password: user.password}; });
                this.users = recs;
                this.users.forEach(user => {
                    delete user.password;
                });
                console.log('users loaded');
                resolve(this);
            }).bind(this));
        };

        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = function(resolve, reject) {
            console.log('Clearing users...');
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing users: ' + err);
                    reject(err);
                } else {
                    console.log('Users have been cleared');
                    this.users = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        };

        let compactOp = function(resolve, reject) {
            console.log('Compacting users datafile...');
            db.once('compaction.done', () => {
                console.log('Users datafile compacted');
                resolve(null);
            });
            db.persistence.compactDatafile();
        };

        return new Promise(clearOp.bind(this)).then(() => new Promise(compactOp));
    }

    prepare(obj) {
        let user = new User(obj);
        if (obj.hasOwnProperty('_id')) {
            user._id = obj._id;
        }
        return user;
    }

    findAll() {
        return this.users.slice();
    }

    findById(theUserId) {
        return this.users.find(user => user._id === theUserId);
    }

    findByEmail(theEmail) {
        return this.users.find(user => user.email === theEmail);
    }

    save(user) {
        let rec;
        let saveOp;

        if (user.hasOwnProperty('_id')) {
            rec = this.findById(user._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                let phUser = UserCache.toPhysicalRecord(user);
                phUser.password = bcrypt.hashSync(user.password, 10);
                db.insert(phUser, (function(err, savedUser) {
                    const newUser = this.toLogicalRecord(savedUser);
                    this.users.push(newUser);
                    this.passwords.push({ id: savedUser._id, password: savedUser.password });
                    resolve(newUser);
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(user)) {
                    db.update({ _id: rec._id }, { $set: UserCache.toPhysicalRecord(rec) }, {}, function(err, numAffected) {
                        err ? reject(err) : resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    authenticate(theEmail, thePassword) {
        const user = this.findByEmail(theEmail);
        if (user) {
            const foundPasswordRecord = this.passwords.find(passwordRecord => passwordRecord.id === user._id);
            if (foundPasswordRecord && bcrypt.compareSync(thePassword, foundPasswordRecord.password)) {
                return user;
            }
        }
        return null;
    }

    static toPhysicalRecord(user) {
        let rec = {};

        if (user.hasOwnProperty('_id')) {
            rec._id = user._id;
        }

        rec.email = user.email;
        rec.name = user.name;
        rec.registration = user.registration;
        // rec.password = bcrypt.hashSync(user.password, 10);

        return rec;
    }

    toLogicalRecord(rec) {
        let user = new User(null);

        user._id = rec._id;
        user.email = rec.email;
        user.name = rec.name;
        user.registration = rec.registration;

        delete user.password;

        return user;
    }
}

module.exports = {
    UserCache
};
