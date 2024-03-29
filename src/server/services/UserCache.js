'use strict';

const User = require('../model/User');
const encryptionUtils = require('../utils/encryptionUtils');

class UserCache {
    constructor(db) {
        this.db = db;
        this.users = [];
        this.passwords = new Map();
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading users...');
            this.db.find({}, (function(err, recs) {
                recs.forEach(rec => {
                    this.passwords.set(rec._id, rec.password);
                });
                this.users = recs.map(rec => UserCache.toLogicalRecord(rec));
                console.log(`users loaded: ${this.users.length} entries`);
                resolve(this);
            }).bind(this));
        }).bind(this);

        return new Promise(load);
    }

    clear() {
        let clearOp = (function(resolve, reject) {
            console.log('Clearing users...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
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
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting users datafile...');
            this.db.once('compaction.done', () => {
                console.log('Users datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    dump() {
        console.log('Users:');
        console.log(JSON.stringify(this.users, null, 2));
        console.log('');
    }

    prepare(obj) {
        return new User(obj);
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
                userToSave.password = encryptionUtils.encrypt(theUser.newPassword);
                this.db.insert(userToSave, (function(err, savedUser) {
                    const newUser = UserCache.toLogicalRecord(savedUser);
                    this.users.push(newUser);
                    this.passwords.set(savedUser._id, savedUser.password);
                    theUser._id = newUser._id;
                    resolve(newUser);
                }).bind(this));
            }).bind(this);
        } else {
            saveOp = (function(resolve, reject) {
                if (foundLogicalUser.update(theUser) || theUser.newPassword) {
                    let userToSave = UserCache.toPhysicalRecord(foundLogicalUser);
                    userToSave.password = (theUser.newPassword) ? encryptionUtils.encrypt(theUser.newPassword) : this.getPasswordByUserId(foundLogicalUser._id);
                    this.db.update({ _id: foundLogicalUser._id }, userToSave, {}, (function(err, numAffected) {
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
            }).bind(this);
        }

        return new Promise(saveOp);
    }

    authenticate(theEmail, thePassword) {
        const user = this.findByEmail(theEmail);
        if (user) {
            const password = this.getPasswordByUserId(user._id);
            if (password && encryptionUtils.compare(thePassword, password)) {
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

        physicalRecord.gender = theUser.gender;
        physicalRecord.email = theUser.email;
        physicalRecord.name = theUser.name;
        physicalRecord.address = theUser.address;
        physicalRecord.registration = new Date(theUser.registration);
        physicalRecord.pageSize = theUser.pageSize;

        return physicalRecord;
    }

    static toLogicalRecord(thePhysicalRecord) {
        let user = new User(null);

        user._id = thePhysicalRecord._id;
        user.gender = thePhysicalRecord.gender;
        user.email = thePhysicalRecord.email;
        user.name = thePhysicalRecord.name;
        user.address = thePhysicalRecord.address;
        user.registration = thePhysicalRecord.registration;
        user.pageSize = thePhysicalRecord.pageSize;

        delete user.currentPassword;
        delete user.newPassword;
        delete user.passwordConfirmation;

        return user;
    }
}

module.exports = UserCache;
