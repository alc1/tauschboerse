'use strict';

const User = require('../../shared/businessobjects/User');
const bcrypt = require('bcrypt');
const db = require('./dataFiles').dbUsers;

class UserCache {
    constructor() {
        this.users = [];
        this.passwords = new Map();
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading users...');
            db.find({}, (function(err, recs) {
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
                let userToSave = UserCache.toPhysicalRecord(user);
                userToSave.password = bcrypt.hashSync(user.newPassword, 10);
                db.insert(userToSave, (function(err, savedUser) {
                    const newUser = this.toLogicalRecord(savedUser);
                    this.users.push(newUser);
                    this.passwords.set(savedUser._id, savedUser.password);
                    user._id = newUser._id;
                    resolve(newUser);
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(user)) {
                    let userToSave = UserCache.toPhysicalRecord(rec);
                    userToSave.password = (user.newPassword) ? bcrypt.hashSync(user.newPassword, 10) : this.getPasswordByUserId(rec._id);
                    db.update({ _id: rec._id }, userToSave, {}, (function(err, numAffected) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.passwords.set(rec._id, userToSave.password);
                            resolve(rec);
                        }
                    }).bind(this));
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
            const password = this.getPasswordByUserId(user._id);
            if (password && bcrypt.compareSync(thePassword, password)) {
                return user;
            }
        }
        return null;
    }

    getPasswordByUserId(theUserId) {
        return this.passwords.get(theUserId);
    }

    static toPhysicalRecord(user) {
        let rec = {};

        if (user.hasOwnProperty('_id')) {
            rec._id = user._id;
        }

        rec.email = user.email;
        rec.name = user.name;
        rec.registration = new Date(user.registration);

        return rec;
    }

    toLogicalRecord(rec) {
        let user = new User(null);

        user._id = rec._id;
        user.email = rec.email;
        user.name = rec.name;
        user.registration = rec.registration;

        delete user.password;
        delete user.currentPassword;
        delete user.newPassword;
        delete user.passwordConfirmation;

        return user;
    }
}

module.exports = {
    UserCache
};
