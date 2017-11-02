'use strict';

const dataCache = require('../services/DataCache').dataCache;

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
        res.sendStatus(404);
    }
}

function findTransaction(id, userId) {
    let transaction = dataCache.getTransaction(id);
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
