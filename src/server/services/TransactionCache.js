'use strict';

const Transaction = require('../../shared/businessobjects/Transaction');

class TransactionCache {
    constructor(db, users) {
        this.db = db;
        this.users = users;

        this.transactions = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading transactions...');
            this.db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading transactions');
                    reject(err);
                } else {
                    this.transactions = recs.map(rec => this.toLogicalRecord(rec));
                    console.log('transactions loaded');
                    resolve(recs);
                }
            }).bind(this));
        }).bind(this);
        
        return new Promise(load);
    }

    clear() {
        let clearOp = (function(resolve, reject) {
            console.log('Clearing transactions...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing transactions: ' + err);
                    reject(err);
                } else {
                    console.log('Transactions cleared');
                    this.transactionss = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting transactions datafile...');
            this.db.on('compaction.done', () => {
                console.log('Transactions datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    save(transaction) {
        let rec;
        let saveOp;

        if (transaction.hasOwnProperty('_id')) {
            rec = this.find(transaction._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                this.db.insert(TransactionCache.toPhysicalRecord(transaction), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newTransaction = this.toLogicalRecord(newRec);
                        this.transactions.push(newTransaction);
                        resolve(newTransaction);
                    }
                }).bind(this));
            }).bind(this);
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(transaction)) {
                    db.update({_id: rec._id}, TransactionCache.toPhysicalRecord(rec), {}, function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            }).bind(this);
        }

        return new Promise(saveOp);
    }

    delete(id) {
        let deleteOp = (function(resolve, reject) {
            let transaction = this.find(id);
            if (transaction) {
                this.transactions.remove(transaction);
                this.db.remove({ _id: transaction._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }).bind(this);
        
        return new Promise(deleteOp);
    }

    prepare(obj, user) {
        return new Transaction(obj);
    }

    static toPhysicalRecord(transaction) {
        let rec = {};

        if (transaction.hasOwnProperty('_id')) {
            rec._id = transaction._id;
        }

        rec.user1Id = transaction.user1 ? transaction.user1._id : null;
        rec.user2Id = transaction.user2 ? transaction.user2._id : null;
        
        return rec;
    }

    toLogicalRecord(rec) {
        let transaction = new Transaction(null);
        transaction._id = rec._id;

        transaction.user1 = this.users.find(rec.user1Id);
        transaction.user2 = this.users.find(rec.user2Id);

        return transaction;
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
