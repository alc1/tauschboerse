'use strict';

const User = require('../../shared/businessobjects/User');
const bcrypt = require('bcrypt');
const db = require('./dataFiles').datafiles.dbUsers;

class UserCache {
    constructor() {
        this.users = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading users...');
            db.find({}, (function(err, recs) {
                this.passwords = recs.map(user => { return { id: user._id, pwd: user.password}; });
                this.users = recs;
                this.users.forEach(user => {
                    delete user.password;
                });
                console.log('users loaded');
                resolve(this);
            }).bind(this));
        }).bind(this);
        
        return new Promise(load);
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

    find(id) {
        return this.users.find(user => user._id === id);
    }

    save(user) {
        let rec;
        let saveOp;

        if (user.hasOwnProperty('_id')) {
            rec = this.find(user._id);
        }

        if (!rec) {
            rec = new User(user);
            saveOp = (function(resolve, reject){
                db.insert(rec, (function(err, newUser){
                    this.users.push(newUser);
                    user._id = newUser._id;
                    resolve(newUser);
                }).bind(this));
            });
        } else {            
            saveOp = (function(resolve, reject){
                if (rec.update(user)) {
                    db.update({ _id: rec._id }, rec, (function(err, numAffected){
                        err ? reject(err) : resolve(rec);
                    }));
                } else {
                    resolve(rec);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    authenticate(id, pwd) {
        let rec = this.passwords.find(r => r.id === id);
        return rec ? bcrypt.compareSync(pwd, user.pwd) : false;
    }
}

module.exports = {
    UserCache
};
