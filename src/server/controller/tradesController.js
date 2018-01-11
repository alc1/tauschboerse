'use strict';

const dataCache = require('../services/DataCache').dataCache;
const Offer = require('../model/Offer');
const OfferState = require('../../shared/constants/OfferState');
const Trade = require('../model/Trade');
const TradeState = require('../../shared/constants/TradeState');
const Article = require('../model/Article');
const ArticleStatus = require('../../shared/constants/ArticleStatus');
const ParameterValidationError = require('../utils/ParameterValidationError');

// creates and adds a new trade to the db
function addTrade(req, res) {
    try {
        const { articleIds } = req.body;

        // prepare new trade for the specified articles
        let trade = prepareNewTrade(articleIds, req.user);

        // save it and send it back to the caller
        saveAndSendTrade(trade, res);
    } catch(e) {
        handleError(e);
    }
}

// Sets the articles to be traded in the specified trade
function setTradeArticles(req, res) {
    try {
        const { tradeId } = req.params;
        let trade = dataCache.getTrade(tradeId);
        checkTradeExists(trade);
        checkUserIsPartOfTrade(trade, req.user);

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
            throw new ParameterValidationError(400, 'All specified articles must belong to the trade partners');
        }

        // if the article(s) owner is not a part of this trade, send an error
        checkUserIsPartOfTrade(trade, articleOwners[0]);

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
        saveAndSendTrade(trade, res);
    } catch(e) {
        handleError(e, res);
    }
}

// set the state of the trade with the given id
// ---------------------------
// POST /api/trades/{id}/state
// ---------------------------
function setTradeState(req, res) {
    try {
        const { tradeId } = req.params;
        const trade = dataCache.getTrade(tradeId);
        checkTradeExists(trade);
        checkUserIsPartOfTrade(trade, req.user);

        const newState = req.body.state;
        checkNewStateIsValid(newState);

        switch(newState) {
            case 'ACCEPTED':
                setStateToAccepted(trade);
                break;

            case 'CANCELED':
                setStateToCanceled(trade);
                break;

            case 'DECLINED':
                setStateToDeclined(trade);
                break;

            case 'REQUESTED':
                setStateToRequested(trade);
                break;

            default:
                throw new ParameterValidationError(500, `The state [${newState}] hasn't been implemented yet`);
        }
    } catch(e) {
        handleError(e, res);
    }

    // Sends a new offer to the trade partner, if the offer is valid
    function setStateToRequested(trade) {
        if ((trade.currentOffer.state === OfferState.OFFER_STATE_INIT) && (trade.currentOffer.sender = req.user)) {
            let newTrade = prepareTradeCopy(trade, TradeState.TRADE_STATE_IN_NEGOTIATION);
            setOfferState(newTrade.offers, OfferState.OFFER_STATE_REQUESTED);

            // If this isn't the first offer, and the last offer is still in the requested state, then the user is now sending a counteroffer.
            // When a counteroffer is sent, the received offer should be declined  automatically.
            if ((newTrade.offers.length > 1) && (newTrade.offers[1].state === OfferState.OFFER_STATE_REQUESTED)) {
                setOfferState(newTrade.offers, OfferState.OFFER_STATE_DECLINED, 1);
            }

            // set state of all involved articles to 'DEALING'
            setArticlesState(newTrade.currentOffer.articles, ArticleStatus.STATUS_DEALING);

            // reset state of articles that were removed to make the current offer
            let removedArticles = newTrade.getArticlesRemovedForCurentOffer();
            let articlesToReset = removedArticles.filter(article => (article.status === ArticleStatus.STATUS_DEALING) && (dataCache.getTradesByArticle(article._id, true).length === 0));
            setArticlesState(articlesToReset, ArticleStatus.STATUS_FREE);

            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    // Accepts a received trade
    function setStateToAccepted(trade) {
        if (currentOfferWasSentToUser(trade)) {
            let newTrade = prepareTradeCopy(trade, TradeState.TRADE_STATE_COMPLETED);
            setOfferState(newTrade.offers, OfferState.OFFER_STATE_ACCEPTED);

            setArticlesState(newTrade.currentOffer.articles, ArticleStatus.STATUS_DEALED);
            findAndFlagInvalidTrades(newTrade.currentOffer.articles);

            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    // Declines a received trade
    function setStateToDeclined(trade) {
        if (currentOfferWasSentToUser(trade)) {
            let newTrade = prepareTradeCopy(trade, TradeState.TRADE_STATE_IN_NEGOTIATION);
            setOfferState(newTrade.offers, OfferState.OFFER_STATE_DECLINED);
            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    // Cancels the current offer
    function setStateToCanceled(trade) {
        if (currentOfferWasMadeByUser(trade)) {
            let newTrade = prepareTradeCopy(trade, TradeState.TRADE_STATE_CANCELED);
            setOfferState(newTrade.offers, (offer.sender === req.user) ? OfferState.OFFER_STATE_WITHDRAWN : OfferState.OFFER_STATE_DECLINED);
            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    function prepareTradeCopy(trade, newState) {
        let newTrade = makeShallowCopy(trade);
        newTrade.state = newState;
        newTrade.offers = trade.offers.slice();

        return newTrade;
    }

    function setOfferState(offers, newState, idx = 0) {
        let offer = makeShallowCopy(offers[idx]);
        offer.state = newState;
        offers[idx] = offer;

        return offer;
    }

    function setArticlesState(articles, newStatus) {
        let copy;

        articles.forEach(async article => {
            if (article.status !== newStatus) {
                copy = makeShallowCopy(article);
                copy.status = newStatus;
                try {
                    await dataCache.saveArticle(copy);
                } catch(e) {
                    console.log(e);
                }
            }
        });
    }

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
            let copy = makeShallowCopy(trade);
            setOfferState(copy.offers, OFFER_STATE_INVALIDATED, trade.hasCounteroffer ? 1 : 0);
            try {
                await dataCache.saveTrade(copy);
            } catch(e) {
                console.log(e);
            }
        });
    }

    function userHasPreparedCounteroffer(trade) {
        return (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_INIT) && (trade.currentOffer.sender === req.user) && (trade.offers.length > 1) && (trade.offers[1].state === OFFER_STATE_REQUESTED);
    }

    function currentOfferWasSentToUser(trade) {
        return ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender !== req.user)) || userHasPreparedCounteroffer(trade);
    }

    // TO DO: take counteroffer into account!!
    function currentOfferWasMadeByUser(trade) {
        return (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender === req.user);
    }
}


function getUserTrades(req, res, userId) {
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


function getTradesByUser(req, res) {
    const { userId } = req.params;
    getUserTrades(req, res, userId);
}


function getTrades(req, res) {
    getUserTrades(req, res, req.user._id);
}


function getTrade(req, res) {
    try {
        const { tradeId } = req.params;
        let trade = findTrade(tradeId);
        checkTradeExists(trade);
        checkUserIsPartOfTrade(trade, req.user);

        res.json({ trade: trade });
    }
    catch(e) {
        handleError(e, res);
    }
}

// prepares a new trade for the given article and returns it to the caller without saving it in the db
function getNewTrade(req, res) {
    try {
        const { articleId } = req.params;
        let trade = prepareNewTrade([articleId], req.user);
        res.json({ trade: trade });
    } catch(e) {
        handleError(e);
    }
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

function prepareNewTrade(articleIds, user) {
    let articles = dataCache.getArticlesById(articleIds);

    // get a list of article owners (excluding the caller)
    let articleOwners = getArticleOwners(articles, user);

    // if no trade-partner or more than one found, trade cannot be created
    if (articleOwners.length > 1) {
        throw new ParameterValidationError(400, 'All articles must belong to either the caller or one potential trade partner');
    }

    // if no trade-partner or more than one found, trade cannot be created
    if (articleOwners.length === 0) {
        throw new ParameterValidationError(400, 'At least one article must belong to someone other than the caller');
    }

    // create new trade
    let trade = new Trade();
    trade.user1 = user;
    trade.user2 = articleOwners[0];
    trade.addOffer(user, articles);

    return trade;
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

function getArticleOwners(articles, user) {
    let articleOwners = [];

    articles.forEach(article => {
        if ((article.owner !== user) && (articleOwners.indexOf(article.owner) < 0)) {
            articleOwners.push(article.owner);
        }
    });

    return articleOwners;
}

function saveAndSendTrade(trade, res) {
    dataCache.saveTrade(trade)
        .then(newTrade => { res.json({ trade: newTrade }); })
        .catch(err => { res.status(500).json(err); });
}

function handleError(e, res) {
    if (e instanceof ParameterValidationError) {
        res.status(e.statusCode).json(e.message);
    } else {
        res.status(500).json(e);
    }
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
