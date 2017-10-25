'use strict';

const router = require('express').Router();
const authenticationMiddleware = require('../middleware/authentication');
const transactionsController = require('../controller/transactionsController');

//router.get('/', authenticationMiddleware, transactionsController.getTransactions);
router.get('/:transactionId', authenticationMiddleware, transactionsController.getTransaction);
//router.get('/:transactionId/offers', authenticationMiddleware, transactionsController.getTransactionOffers);
//router.get('/:transactionId/offers/:offerId', authenticationMiddleware, transactionsController.getTransactionOffer);

module.exports = router;