'use strict';

const dataCache = require('../services/cache').dataCache;

function getUserTransactions(req, res) {
    const { userId } = req.params;
    return dataCache.getUserTransactions(userId);
}

function getTransaction(req, res) {
    const { transactionId } = req.params;
    return dataCache.getTransaction(transactionId);
}

module.exports = {
    getTransactions,
    getTransaction
};
