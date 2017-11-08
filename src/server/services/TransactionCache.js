'use strict';

const db = require('./dataFiles').dbTransactions;

class TransactionCache {
    constructor(users) {
        this.users = users;

        this.transactions = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading transactions...');
            db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading transactions');
                    reject(err);
                } else {
                    this.transactions = recs.map(rec => this.toLogicalRecord(rec));
                    console.log('transactions loaded');
                    resolve(recs);
                }
            }).bind(this));
        };
        
        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = function(resolve, reject) {
            console.log('Clearing transactions...');
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing transactions: ' + err);
                    reject(err);
                } else {
                    console.log('Transactions cleared');
                    this.transactionss = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        };

        let compactOp = function(resolve, reject) {
            console.log('Compacting transactions datafile...');
            db.on('compaction.done', () => {
                console.log('Transactions datafile compacted');
                resolve(null);
            });
            db.persistence.compactDatafile();
        };

        return new Promise(clearOp.bind(this)).then(() => new Promise(compactOp));
    }

    save(transaction) {
        let rec;
        let saveOp;

        if (transaction.hasOwnProperty('_id')) {
            rec = this.find(transaction._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                db.insert(TransactionCache.toPhysicalRecord(transaction), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newTransaction = this.toLogicalRecord(newRec);
                        this.transactions.push(newTransaction);
                        resolve(newTransaction);
                    }
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(transaction)) {
                    db.update({_id: rec._id}, TransactionCache.toPhysicalRecord(rec), function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    delete(id) {
        deleteOp = function(resolve, reject) {
            let transaction = this.find(id);
            if (transaction) {
                this.transactions.remove(transaction);
                db.remove({ _id: category._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }
        
        return new Promise(deleteOp.bind(this));
    }

    prepare(obj, user) {
        let transaction = new Transaction(obj);
        if (obj.hasOwnProperty('_id')) {
            transaction._id = obj._id;
        }

        return transaction;
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
