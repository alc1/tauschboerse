'use strict';

const db = require('./dataFiles').dbTransactions;

class TransactionCache {
    constructor(users) {
        this.users = users;

        this.transactions = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading transactions...');
            db.find({}, (function(err, recs) {
                this.transactions = recs;
                recs.forEach(rec => {
                    rec.user1 = this.users.find(rec.user1Id);
                    rec.user2 = this.users.find(rec.user2Id);
                });
                console.log('transactions loaded');
                resolve(recs);
            }).bind(this));
        }).bind(this);
        
        return new Promise(load);
    }

    clear() {
        return new Promise((function(resolve, reject) {
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                this.transactionss = [];
                resolve(numRemoved);
            }).bind(this));
        }).bind(this));
    }

    save(transaction) {

    }

    findAll() {
        return this.transactions.slice();
    }

    find(id) {
        return this.transactions.find(trans => trans._id === id);
    }

    findByUserId(userId) {
        return this.transactions.filter(t => (t.user1Id === userId) || (t.user2Id === userId));
    }
}

module.exports = {
    TransactionCache
};
