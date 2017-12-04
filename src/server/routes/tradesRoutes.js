'use strict';

const router = require('express').Router();
const authenticationMiddleware = require('../middleware/authentication');
const tradesController = require('../controller/tradesController');

router.get('/', authenticationMiddleware, tradesController.getTrades);
router.get('/:tradeId', authenticationMiddleware, tradesController.getTrade);
//router.get('/:tradeId/offers', authenticationMiddleware, tradesController.getTradeOffers);
//router.get('/:tradeId/offers/:offerId', authenticationMiddleware, tradesController.getTradeOffer);

module.exports = router;