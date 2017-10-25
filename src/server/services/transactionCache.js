'use strict'

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const dbTransactions = dataFiles.dbTransactions;
const dbTransactionOffers = dataFiles.dbTransactionOffers;

class TransactionCache {
    constructor(users, offers) {
        this.users = users;
        this.offers = offers;

        this.transactions = [];
    }

    init() {
        function initTransactions() {
            return new Promise((resolve, reject) => {
                console.log('Loading transactions...');
                dbTransactions.find({}, (err, recs) => {
                    this.transactions = recs;
                    recs.forEach(rec => {
                        rec.user1 = this.users.find(rec.user1Id);
                        rec.user2 = this.users.find(rec.user2Id);
                    });
                    console.log('transactions loaded');
                    resolve(this);
                });
            });
        }
    
        function initTransactionOffers() {
            return new Promise((resolve, reject) => {
                console.log('Loading transaction offers...');
                dbTransactionOffers.find({}, (err, recs) => {
                    recs.forEach(rec => {
                        let transaction = this.find(rec.transactionId);
                        let offer = this.offers.find(rec.offerId);
        
                        if (!transaction.offers) {
                            transaction.offers = [];
                        }
                        transaction.offers.push(offer);
                    });
                    console.log('transaction offers loaded');
                    resolve(this);
                });
            });
        }
    
        return this.initTransactions().then(() => this.initTransactionOffers());
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
