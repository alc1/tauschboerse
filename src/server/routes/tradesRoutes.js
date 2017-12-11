'use strict';

const router = require('express').Router();
const authenticationMiddleware = require('../middleware/authentication');
const tradesController = require('../controller/tradesController');

router.get('/', authenticationMiddleware, tradesController.getTrades);
router.post('/', authenticationMiddleware, tradesController.addTrade);
router.get('/:tradeId', authenticationMiddleware, tradesController.getTrade);
router.put('/:tradeId/articles', authenticationMiddleware, tradesController.setTradeArticles);
router.put('/:tradeId/state', authenticationMiddleware, tradesController.setTradeState);

module.exports = router;