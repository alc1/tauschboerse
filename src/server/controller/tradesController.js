'use strict';

const dataCache = require('../services/DataCache').dataCache;
const Offer = require('../../shared/businessobjects/Offer');
const OfferState = require('../../shared/businessobjects/OfferState');
const Trade = require('../../shared/businessobjects/Trade');
const TradeState = require('../../shared/businessobjects/TradeState');

function addTrade(req, res) {
    const { articleIds } = req.body;
    let articles = dataCache.getArticlesById(articleIds);

    let articleOwners = [];
    articles.forEach(article => {
        if ((article.owner !== req.user) && (articleOwners.indexOf(article.owner) < 0)) {
            articleOwners.push(article.owner);
        }
    });

    if (articleOwners.length < 2) {
        let trade = new Trade();
        trade.user1 = req.user;

        if (articleOwners.length === 1) {
            trade.user2 = articleOwners[0];
            trade.addOffer(req.user, articles);
        } else {
            trade.user2 = null;
        }
        dataCache.saveTrade(trade);
        res.json(trade);
    } else {
        res.sendStatus(400);
    }
}

function setTradeArticles(req, res) {
    const { tradeId } = req.params;
    let trade = dataCache.getTrade(tradeId);

    requestStatus = 200;
    if (trade != null) {
        const { articleIds } = req.body;
        let articles = dataCache.getArticlesById(articleIds);

        let articleOwners = [];
        articles.forEach(article => {
            if ((article.owner !== req.user) && (articleOwners.indexOf(article.owner) < 0)) {
                articleOwners.push(article.owner);
            }
        });

        if (articleOwners.length === 1) {
            if ((trade.user1 == articleOwners[0]) || (trade.user2 == articleOwners[0])) {
                if ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.offers[0].sender === req.user)) {
                    trade = makeShallowCopy(trade);
                    trade.setArticles(articles);
                } else if (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) {
                    if ((trade.currentOffer.state === OfferState.OFFER_STATE_INIT) && (trade.currentOffer.sender === req.user)) {
                        trade = makeShallowCopy(trade);
                        trade.setArticles(articles);
                    } else if ((trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender !== req.user)) {
                        trade = makeShallowCopy(trade);
                        trade.addOffer(articles);
                    } else if ((trade.currentOffer.state === OfferState.OFFER_STATE_DECLINED) && (trade.currentOffer.sender === req.user)) {
                        trade = makeShallowCopy(trade);
                        trade.addOffer(articles);
                    } else {
                        requestStatus = 403;
                    }

                    if (requestStatus === 200) {
                        dataCache.saveTrade(trade);
                    }
                } else {
                    // trade is not in a state where the articles can be changed
                    requestStatus = 403;
                }
            } else {
                // articles don't belong to any of the trade partners
                requestStatus = 400;
            }
        } else {
            // articles given that don't belong either to more than 2 different people
            requestStatus = 400;
        }
    } else {
        // trade was not found
        requestStatus = 404;
    }

    if (requestStatus === 200) {
        res.json(trade);
    } else {
        res.sendStatus(requestStatus);
    }
}

function setTradeState(req, res) {
    const { tradeId } = req.params;
    let trade = dataCache.getTrade(tradeId);

    const newState = req.body;

    let requestStatus = 200;
    if (trade != null) {
        if (newState === 'REQUESTED') {
            if ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1 === req.user)) {
                let trade = makeShallowCopy(trade);
                trade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
                let offer = makeShallowCopy(trade.currentOffer);
                offer.state = OFFER_STATE_REQUESTED;
                trade.offers = [offer];
                dataCache.saveTrade(trade);
            } else if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OFFER_STATE_INIT) && (trade.currentOffer.sender = req.user)) {
                let trade = makeShallowCopy(trade);
                trade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
                trade.offers = trade.offers.slice();
                let offer = makeShallowCopy(trade.currentOffer);
                offer.state = OFFER_STATE_REQUESTED;
                trade.offers[0] = offer;
                if ((trade.offers.length > 1) && (trade.offers[1].state === OfferState.OFFER_STATE_REQUESTED)) {
                    let offer = makeShallowCopy(trade.offers[1]);
                    offer.state = OFFER_STATE_DECLINED;
                    trade.offers[1] = offer;
                }
                dataCache.saveTrade(trade);
            } else {
                // trade state cannot be changed to REQUESTED
                requestStatus = 403;
            }
        } else if ((newState === 'ACCEPTED') && (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender !== req.user)) {
            let trade = makeShallowCopy(trade);
            trade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
            trade.offers = trade.offers.slice();
            let offer = makeShallowCopy(trade.currentOffer);
            offer.state = OFFER_STATE_ACCEPTED;
            trade.offers[0] = offer;
            dataCache.saveTrade(trade);
        } else if (newState === 'DECLINED') {
            if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OFFER_STATE_REQUESTED)) {
                let trade = makeShallowCopy(trade);
                trade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
                trade.offers = trade.offers.slice();
                let offer = makeShallowCopy(trade.currentOffer);
                offer.state = OFFER_STATE_DECLINED;
                trade.offers[0] = offer;
                dataCache.saveTrade(trade);
            } else {
                requestStatus = 403;
            }
        } else {
            requestStatus = 403;
        }
    } else {
        requestStatus = 404;
    }

    if (requestStatus === 200) {
        res.json(trade);
    } else {
        res.sendStatus(requestStatus);
    }
}

function getTradesByUser(req, res) {
    const { userId } = req.params;
    let trades = dataCache.getTradesByUser(userId)
        // if trade hasn't been started yet, it is only visible to user1
        .filter(trade => ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1 === req.user)) || (trade.state !== TradeState.TRADE_STATE_INIT))
        // offers that haven't been made yet are only visible to the sender
        .map(trade => {
            if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && trade.offers.some(offer => offer.state === OfferState.OFFER_STATE_INIT)) {
                return makeShallowCopy(trade).offers.filter(offer => (offer.state !== OfferState.INIT) || (offer.sender === req.user));
            } else {
                return trade;
            }
        });
    res.json({ trades: trades });
}

function getTrades(req, res) {
    res.json({ trades: dataCache.getAllTrades() });
}

function getTrade(req, res) {
    const { tradeId } = req.params;
    let trade = findTrade(tradeId);
    if (trade) {
        res.json({ trade: trade });
    } else {
        res.sendStatus(404);
    }
}

function findTrade(id, userId) {
    let trade = dataCache.getTrade(id);
    if (trade) {
        if ((trade.user1Id !== userId) && (trade.user2Id !== userId)) {
            trade = undefined;
        }
    }

    return trade;
}

function makeShallowCopy(obj) {
    return object.assign({}, obj);
}

module.exports = {
    addTrade,
    setTradeArticles,
    setTradeState,
    getTradesByUser,
    getTrades,
    getTrade
};
