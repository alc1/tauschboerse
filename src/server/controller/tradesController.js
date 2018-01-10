'use strict';

const dataCache = require('../services/DataCache').dataCache;
const Offer = require('../model/Offer');
const OfferState = require('../../shared/constants/OfferState');
const Trade = require('../model/Trade');
const TradeState = require('../../shared/constants/TradeState');
const ParameterValidationError = require('../utils/ParameterValidationError');

function addTrade(req, res) {
    const { articleIds } = req.body;
    let articles = dataCache.getArticlesById(articleIds);

    // get a list of article owners (excluding the caller)
    let articleOwners = getArticleOwners(articles, req.user);

    // if no trade-partner or more than one found, trade cannot be created
    if (articleOwners.length !== 1) {
        res.sendStatus(400);
        return;
    }

    // create new trade
    let trade = new Trade();
    trade.user1 = req.user;
    trade.user2 = articleOwners[0];
    trade.addOffer(req.user, articles);

    // save it and send response back to caller
    saveTrade(trade, res);
}

function setTradeArticles(req, res) {
    try {
        const { tradeId } = req.params;
        let trade = dataCache.getTrade(tradeId);
        checkTradeExists(trade);
        checkUserIsPartOfTrade(req.user);

        // For trades being initialised the user can only change the articles if he or she created the trade
        if (trade.state === TradeState.TRADE_STATE_INIT) {
            if (trade.offers[0].sender !== req.user) {
                throw new ParameterValidationError(403, 'The trade cannot be modified in its current state');
            }
        }
        // For trades in negotiation the user can only change the articles of new offers, declined offers, invalidated offers and offers sent to him or her (counter offer)
        else if (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) {
            if (trade.currentOffer.sender === req.user) {
                if ((trade.currentOffer.state !== OfferState.OFFER_STATE_INIT) && (trade.currentOffer.state !== OfferState.OFFER_STATE_DECLINED) && (trade.currentOffer.state !== OfferState.OFFER_STATE_INVALIDATED)) {
                    throw new ParameterValidationError(403, 'The trade cannot be modified in its current state');
                }
            } else {
                if (trade.currentOffer.state !== OfferState.OFFER_STATE_REQUESTED) {
                    throw new ParameterValidationError(403, 'The trade cannot be modified in its current state');
                }
            }
        }
        // Trades in all other states cannot have their articles changed
        else {
            throw new ParameterValidationError(403, 'The trade cannot be modified in its current state');
        }

        // collect a list of owners for all articles passed in who aren't the calling user
        const { articleIds } = req.body;
        let articles = dataCache.getArticlesById(articleIds);
        let articleOwners = getArticleOwners(articles, req.user);

        // if more that one owner (trade partner) were found, send an error
        if (articleOwners.length > 1) {
            throw new ParameterValidationError(400, 'All specified articles must belong to the same two users');
        }

        // if the article(s) owner is not a part of this trade, send an error
        checkUserIsPartOfTrade(articleOwners[0]);

        // the user can modify the trade - first make a new copy
        trade = makeShallowCopy(trade);

        // if the trade is still being initialised, update the articles
        if (trade.state === TradeState.TRADE_STATE_INIT) {
            trade.setArticles(articles);
        }
        // For trades in negotiation with offers being initialised change the articles, otherwise create a new offer
        else if (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) {
            if (trade.currentOffer.state === OfferState.OFFER_STATE_INIT) {
                trade.setArticles(articles);
            } else {
                trade.addOffer(articles);
            }
        }

        // save the changes and send response back to caller        
        saveTrade(trade, res);
    } catch(e) {
        if (e instanceof ParameterValidationError) {
            res.sendStatus(e.statusCode).json(e.message);
        } else {
            res.sendStatus(500).json(err);
        }
    }
}

function setTradeState(req, res) {

    function setStateToRequested(trade) {
        if ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1 === req.user)) {
            newTrade = makeShallowCopy(trade);
            newTrade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
            let offer = makeShallowCopy(trade.currentOffer);
            offer.state = OfferState.OFFER_STATE_REQUESTED;
            newTrade.offers = [offer];
            saveTrade(newTrade, res);
        } else if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OFFER_STATE_INIT) && (trade.currentOffer.sender = req.user)) {
            newTrade = makeShallowCopy(trade);
            //newTrade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
            newTrade.offers = trade.offers.slice();
            let offer = makeShallowCopy(trade.currentOffer);
            offer.state = OfferState.OFFER_STATE_REQUESTED;
            newTrade.offers[0] = offer;
            if ((newTrade.offers.length > 1) && (newTrade.offers[1].state === OfferState.OFFER_STATE_REQUESTED)) {
                offer = makeShallowCopy(trade.offers[1]);
                offer.state = OfferState.OFFER_STATE_DECLINED;
                newTrade.offers[1] = offer;
            }
            saveTrade(newTrade, res);
        } else {
            // trade state cannot be changed to REQUESTED
            throw new ParameterValidationError(403);
        }
    }

    function setStateToAccepted(trade) {
        newTrade = makeShallowCopy(trade);
        newTrade.state = TradeState.TRADE_STATE_COMPLETED;
        newTrade.offers = trade.offers.slice();
        let offer = makeShallowCopy(trade.currentOffer);
        offer.state = OfferState.OFFER_STATE_ACCEPTED;
        newTrade.offers[0] = offer;
        saveTrade(newTrade, res);
    }

    function setStateToDeclined(trade) {
        if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OFFER_STATE_REQUESTED)) {
            newTrade = makeShallowCopy(trade);
            newTrade.state = TradeState.TRADE_STATE_IN_NEGOTIATION;
            newTrade.offers = trade.offers.slice();
            let offer = makeShallowCopy(trade.currentOffer);
            offer.state = OfferState.OFFER_STATE_DECLINED;
            newTrade.offers[0] = offer;
            saveTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    function setStateToCanceled(trade) {
        newTrade = makeShallowCopy(trade);
        newTrade.state = TradeState.TRADE_STATE_CANCELED;
        newTrade.offers = trade.offers.slice();
        let offer = makeShallowCopy(trade.currentOffer);
        offer.state = (offer.sender === req.user) ? OfferState.OFFER_STATE_WITHDRAWN : OfferState.OFFER_STATE_DECLINED;
        newTrade.offers[0] = offer;
        saveTrade(newTrade, res);
    }

    try {
        const { tradeId } = req.params;
        const trade = dataCache.getTrade(tradeId);
        checkTradeExists(trade);

        const newState = req.body.newState;
        checkNewStateIsValid(newState);

        if (newState === 'REQUESTED') {
            setStateToRequested(trade);
        } else if ((newState === 'ACCEPTED') && (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender !== req.user)) {
            setStateToAccepted(trade);
        } else if (newState === 'DECLINED') {
            setStateToDeclined(trade);
        } else if (newState === 'CANCELED') {
            setStateToCanceled(trade);
        }
    } catch(e) {
        if (e instanceof ParameterValidationError) {
            res.sendStatus(e.statusCode).json(e.message);
        } else {
            res.sendStatus(500).json(e);
        }
    }
}


function getTradesByUser(req, res) {
    const { userId } = req.params;
    let trades = dataCache.getTradesByUser(userId)
        // if trade hasn't been started yet, it is only visible to user1
        .filter(trade => ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1 === req.user)) || (trade.state !== TradeState.TRADE_STATE_INIT))
        // offers that haven't been made yet are only visible to the sender
        .map(trade => {
            if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && trade.offers.some(offer => (offer.state === OfferState.OFFER_STATE_INIT) && (offer.sender !== req.user))) {
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


function getNewTrade(req, res) {
    const { articleId } = req.params;
    let article = dataCache.getArticleById(articleId);

    if (article === null) {
        res.sendStatus(404);
    }

    let trade = new Trade();
    trade.user1 = req.user;
    trade.user2 = article.owner;
    trade.addOffer(req.user, [article]);

    res.json({ trade: trade });
}

/**********************************************************************************/
/* Helper Functions                                                               */
/**********************************************************************************/
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
    if (obj instanceof Trade) {
        return new Trade(obj);
    } else if (obj instanceof Offer) {
        return new Offer(obj);
    } else {
        return Object.assign({}, obj);
    }
}

function getArticleOwners(articles, user) {
    let articleOwners = [];

    articles.forEach(article => {
        if ((article.owner !== user) && (articleOwners.indexOf(article.owner) < 0)) {
            articleOwners.push(article.owner);
        }
    });

    return articleOwners;
}

function saveTrade(trade, res) {
    dataCache.saveTrade(trade)
        .then(newTrade => { res.json(newTrade); })
        .catch(err => { res.sendStatus(500).json(err); });
}

function checkTradeExists(trade) {
    if (trade == null) {
        throw new ParameterValidationError(404, `The specified trade does not exist`);
    }
}

function checkUserIsPartOfTrade(trade, user) {
    if ((trade.user1 !== user) && (trade.user2 !== user)) {
        throw new ParameterValidationError(400, 'Only trade partners can modify the trade');
    }
}

// Valid states
const validStates = ['ACCEPTED', 'CANCELED', 'DECLINED', 'REQUESTED'];

function checkNewStateIsValid(value) {
    if (validStates.indexOf(value.toUpperCase()) < 0) {
        throw new ParameterValidationError(400, `The given state [${value}] is not recognized`);
    }
}

module.exports = {
    addTrade,
    setTradeArticles,
    setTradeState,
    getTradesByUser,
    getTrades,
    getTrade,
    getNewTrade
};
