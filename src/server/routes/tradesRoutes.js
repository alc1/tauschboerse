'use strict';

const router = require('express').Router();
const authenticationMiddleware = require('../middleware/authentication');
const tradesController = require('../controller/tradesController');

router.get('/', authenticationMiddleware, tradesController.getTrades);
router.get('/new/:articleId', authenticationMiddleware, tradesController.getNewTrade);
router.post('/', authenticationMiddleware, tradesController.addTrade);
router.get('/:tradeId', authenticationMiddleware, tradesController.getTrade);
router.get('/:tradeId/version', authenticationMiddleware, tradesController.getTradeVersion);
router.delete('/:tradeId', authenticationMiddleware, tradesController.deleteTrade);
router.post('/:tradeId/articles', authenticationMiddleware, tradesController.setTradeArticles);
router.post('/:tradeId/state', authenticationMiddleware, tradesController.setTradeState);

module.exports = router;