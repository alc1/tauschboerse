'use strict';

const router = require('express').Router();
const transactionsController = require('../controller/transactionsController');

router.get('/', transactionsController.getTransactions);
router.get('/:transactionId', transactionsController.getTransaction);

module.exports = router;