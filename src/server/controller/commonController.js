'use strict';

const dataCache = require('../services/DataCache').dataCache;
const OfferState = require('../../shared/constants/OfferState');
const Offer = require('../model/Offer');
const Trade = require('../model/Trade');
const Article = require('../model/Article');

function findAndFlagInvalidTrades(articles, ignoreTradeId) {
    let invalidTrades = [];

    // get list of trades with open offers for any of the given articles
    articles.forEach(article => {
        let trades = dataCache.getTradesByArticle(article._id, true);
        trades.forEach(trade => {
            if ((trade._id !== ignoreTradeId) && (invalidTrades.indexOf(trade) < 0)) {
                invalidTrades.push(trade);
            }
        });
    });

    // invalidate the open offers
    invalidTrades.forEach(async trade => {
        let copy = prepareTradeCopy(trade, trade.state);
        setOfferState(copy.offers, OfferState.OFFER_STATE_INVALIDATED, trade.hasCounteroffer ? 1 : 0);
        try {
            await dataCache.saveTrade(copy);
        } catch(e) {
            console.log(e);
        }
    });
}

function setOfferState(offers, newState, idx = 0) {
    let offer = makeShallowCopy(offers[idx]);
    offer.state = newState;
    offers[idx] = offer;

    return offer;
}

function prepareTradeCopy(trade, newState) {
    let newTrade = makeShallowCopy(trade);
    newTrade.state = newState;
    newTrade.offers = trade.offers.slice();

    return newTrade;
}

function makeShallowCopy(obj) {
    if (obj instanceof Trade) {
        return new Trade(obj);
    } else if (obj instanceof Offer) {
        return new Offer(obj);
    } else if (obj instanceof Article) {
        return new Article(obj);
    } else {
        return Object.assign({}, obj);
    }
}

module.exports = {
    findAndFlagInvalidTrades,
    setOfferState,
    prepareTradeCopy,
    makeShallowCopy
};
