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
                    this.passwords.set(user._id, user.password);
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
                    this.passwords = new Map();
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

    save(theUser) {
        let foundLogicalUser;
        let saveOp;

        if (theUser.hasOwnProperty('_id')) {
            foundLogicalUser = this.findById(theUser._id);
        }

        if (!foundLogicalUser) {
            saveOp = (function(resolve, reject) {
                let userToSave = UserCache.toPhysicalRecord(theUser);
                userToSave.password = bcrypt.hashSync(theUser.newPassword, 10);
                db.insert(userToSave, (function(err, savedUser) {
                    const newUser = UserCache.toLogicalRecord(savedUser);
                    this.users.push(newUser);
                    this.passwords.set(savedUser._id, savedUser.password);
                    theUser._id = newUser._id;
                    resolve(newUser);
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (foundLogicalUser.update(theUser)) {
                    let userToSave = UserCache.toPhysicalRecord(foundLogicalUser);
                    userToSave.password = (theUser.newPassword) ? bcrypt.hashSync(theUser.newPassword, 10) : this.getPasswordByUserId(foundLogicalUser._id);
                    db.update({ _id: foundLogicalUser._id }, userToSave, {}, (function(err, numAffected) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.passwords.set(foundLogicalUser._id, userToSave.password);
                            resolve(foundLogicalUser);
                        }
                    }).bind(this));
                } else {
                    resolve(foundLogicalUser);
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

    static toPhysicalRecord(theUser) {
        let physicalRecord = {};

        if (theUser.hasOwnProperty('_id')) {
            physicalRecord._id = theUser._id;
        }

        physicalRecord.email = theUser.email;
        physicalRecord.name = theUser.name;
        physicalRecord.registration = new Date(theUser.registration);

        return physicalRecord;
    }

    static toLogicalRecord(thePhysicalRecord) {
        let user = new User(null);

        user._id = thePhysicalRecord._id;
        user.email = thePhysicalRecord.email;
        user.name = thePhysicalRecord.name;
        user.registration = thePhysicalRecord.registration;

        delete user.currentPassword;
        delete user.newPassword;
        delete user.passwordConfirmation;

        return user;
    }
}

module.exports = {
    UserCache
};
