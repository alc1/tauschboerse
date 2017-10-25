'use strict';

const dataCache = require('../services/cache').dataCache;

function getUserTransactions(req, res) {
    const { userId } = req.params;
    let transactions = dataCache.getUserTransactions(userId);
    res.json({ transactions: transactions });
}

function getTransaction(req, res) {
    const { transactionId } = req.params;
    let transaction = findTransaction(transactionId);
    if (transaction) {
        res.json({ transaction: transaction });
    } else {
        // TODO: send 404 Object not found
        res.json({ transaction: null });
    }
}

function findTransaction(id, userId) {
    let transaction = dataCache.getTransaction(transactionId);
    if (transaction) {
        if ((transaction.user1Id !== userId) && (transaction.user2Id !== userId)) {
            transaction = undefined;
        }
    }

    return transaction;
}

module.exports = {
    getUserTransactions,
    getTransaction
};
