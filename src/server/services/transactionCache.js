'use strict'

const Datastore = require('nedb');
const dbTransactions = new Datastore({ filename : './data/transactions.db', autoload : true });
const dbTransactionOffers = new Datastore({ filename : './data/transactionOffers.db', autoload : true });

export class TransactionCache {
    constructor(users, offers) {
        this.users = users;
        this.offers = offers;

        this.transactions = [];
    }

    init() {
        db.find({}, (err, recs) => {
            this.transactions = recs;
            recs.forEach(rec => {
                rec.user1 = this.users.find(rec.user1Id);
                rec.user2 = this.users.find(rec.user2Id);
            });
        });

        db.find({}, (err, recs) => {
            recs.forEach(rec => {
                let transaction = this.find(rec.transactionId);
                let offer = this.offers.find(rec.offerId);

                if (!transaction.offers) {
                    transaction.offers = [];
                }
                transaction.offers.push(offer);
            });
        });
    }

    findAll() {
        return this.transactions.slice();
    }

    find(id) {
        return this.transactions.find(trans => trans._id === id);
    }
}