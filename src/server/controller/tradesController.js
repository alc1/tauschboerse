'use strict';

const dataCache = require('../services/DataCache').dataCache;
const Offer = require('../model/Offer');
const OfferState = require('../../shared/constants/OfferState');
const Trade = require('../model/Trade');
const TradeState = require('../../shared/constants/TradeState');
const Article = require('../model/Article');
const ArticleStatus = require('../../shared/constants/ArticleStatus');
const ParameterValidationError = require('../utils/ParameterValidationError');

const commonController = require('./commonController');

// creates and adds a new trade to the db
function addTrade(req, res) {
    try {
        const { articleIds } = req.body;

        // prepare new trade for the specified articles
        let trade = prepareNewTrade(articleIds, req.user);

        // save it and send it back to the caller
        saveAndSendTrade(trade, res);
    } catch(e) {
        handleError(e, res);
    }
}

// Deletes trade from database
function deleteTrade(req, res) {
    try {
        const { tradeId } = req.params;
        let trade = dataCache.getTrade(tradeId);
        checkTradeExists(trade);

        // if trade hasn't been submitted and the caller is the owner - delete it
        if ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.currentOffer.sender === req.user)) {
            dataCache.deleteTrade(tradeId)
                .then(() => res.status(200).json({ trade: null }))
                .catch(err => res.status(500).json(err));
        } else if (trade.hasCounteroffer && (trade.counteroffer.sender === req.user)) {
            // the trade has a counteroffer being prepared - the counteroffer will be deleted
            let newTrade = commonController.prepareTradeCopy(trade, trade.state);
            newTrade.deleteCounteroffer();

            // save it and send it back to the caller
            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    } catch(e) {
        handleError(e, res);
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
            if (trade.hasCounteroffer && (trade.counteroffer.sender !== req.user)) {
                throw new ParameterValidationError(403, 'The trade cannot be modified in its current state');
            } else if (trade.currentOffer.sender === req.user) {
                if ((trade.currentOffer.state !== OfferState.OFFER_STATE_DECLINED) && (trade.currentOffer.state !== OfferState.OFFER_STATE_INVALIDATED)) {
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
        let newTrade = commonController.prepareTradeCopy(trade, trade.state);

        // if the trade is still being initialised, update the articles
        if (newTrade.state === TradeState.TRADE_STATE_INIT) {
            commonController.setOfferArticles(newTrade.offers, articles);
        }
        // For trades in negotiation with offers being initialised change the articles, otherwise create a new offer
        else if (newTrade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) {
            if (newTrade.hasCounteroffer) {
                commonController.setOfferArticles(newTrade.offers, articles);
            } else {
                newTrade.addOffer(req.user, articles);
            }
        }

        // save the changes and send response back to caller        
        saveAndSendTrade(newTrade, res);
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

            case 'DELIVERED':
                setStateToDelivered(trade);
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

    // Accepts a received trade
    function setStateToAccepted(trade) {
        if (currentOfferWasSentToUser(trade)) {
            let newTrade = commonController.prepareTradeCopy(trade, TradeState.TRADE_STATE_COMPLETED);
            commonController.setOfferState(newTrade.offers, OfferState.OFFER_STATE_ACCEPTED);

            setArticlesState(newTrade.currentOffer.articles, ArticleStatus.STATUS_DEALED);
            commonController.findAndFlagInvalidTrades(newTrade.currentOffer.articles);

            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    // Cancels the current offer
    function setStateToCanceled(trade) {
        if (currentOfferWasMadeByUser(trade)) {
            let newTrade = commonController.prepareTradeCopy(trade, TradeState.TRADE_STATE_CANCELED);
            commonController.setOfferState(newTrade.offers, OfferState.OFFER_STATE_WITHDRAWN);

            // reset article states, now that trade has been canceled
            let articlesToReset = newTrade.currentOffer.articles.filter(article => (article.status === ArticleStatus.STATUS_DEALING) && (dataCache.getTradesByArticle(article._id, true).length === 1));
            setArticlesState(articlesToReset, ArticleStatus.STATUS_FREE);

            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    // Declines a received trade
    function setStateToDeclined(trade) {
        if (currentOfferWasSentToUser(trade)) {
            let newTrade = commonController.prepareTradeCopy(trade, TradeState.TRADE_STATE_IN_NEGOTIATION);
            commonController.setOfferState(newTrade.offers, OfferState.OFFER_STATE_DECLINED);
            saveAndSendTrade(newTrade, res);
        } else {
            throw new ParameterValidationError(403);
        }
    }

    //
    function setStateToDelivered(trade) {
        checkTradeIsCompleted(trade);

        let skipSave, newTrade;

        // check if flag has to be set
        if (req.user === trade.user1) {
            skipSave = trade.user1HasDelivered;
        } else {
            skipSave = trade.user2HasDelivered;
        }

        // if flag must be set do it
        if (!skipSave) {
            newTrade = commonController.prepareTradeCopy(trade, trade.state);
            if (req.user === trade.user1) {
                newTrade.user1HasDelivered = true;
            } else {
                newTrade.user2HasDelivered = true;
            }
        } else {
            // although no changes were made, the method returns the trade to the caller
            newTrade = trade;
        }

        // return to caller after saving changes if required
        saveAndSendTrade(newTrade, res, skipSave);
    }

    // Sends a new offer to the trade partner, if the offer is valid
    function setStateToRequested(trade) {
        if ((trade.hasCounteroffer && trade.counteroffer.sender === req.user) || ((trade.currentOffer.state === OfferState.OFFER_STATE_INIT) && (trade.currentOffer.sender === req.user))) {
            let newTrade = commonController.prepareTradeCopy(trade, TradeState.TRADE_STATE_IN_NEGOTIATION);
            commonController.setOfferState(newTrade.offers, OfferState.OFFER_STATE_REQUESTED);

            // If this isn't the first offer, and the last offer is still in the requested state, then the user is now sending a counteroffer.
            // When a counteroffer is sent, the received offer should be declined  automatically.
            if ((newTrade.offers.length > 1) && (newTrade.offers[1].state === OfferState.OFFER_STATE_REQUESTED)) {
                commonController.setOfferState(newTrade.offers, OfferState.OFFER_STATE_DECLINED, 1);
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

    function setArticlesState(articles, newStatus) {
        let copy;

        articles.forEach(async article => {
            if (article.status !== newStatus) {
                copy = commonController.makeShallowCopy(article);
                copy.status = newStatus;
                try {
                    await dataCache.saveArticle(copy);
                } catch(e) {
                    console.log(e);
                }
            }
        });
    }

    function currentOfferWasSentToUser(trade) {
        return ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender !== req.user));
    }

    function currentOfferWasMadeByUser(trade) {
        return (trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (trade.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (trade.currentOffer.sender === req.user);
    }
}


function getUserTrades(userId, tailorOffers = true) {
    let trades = dataCache.getTradesByUser(userId)
        // if trade hasn't been started yet, it is only visible to user1
        .filter(trade => ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1._id === userId)) || (trade.state !== TradeState.TRADE_STATE_INIT));

    // offers that haven't been made yet are only visible to the sender - remove if required and user isn't sender
    if (tailorOffers) {
        trades = trades.map(trade => {
            if ((trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && trade.offers.some(offer => (offer.state === OfferState.OFFER_STATE_INIT) && (offer.sender._id !== userId))) {
                return commonController.makeShallowCopy(trade).offers.filter(offer => (offer.state !== OfferState.OFFER_STATE_INIT) || (offer.sender._id === userId));
            } else {
                return trade;
            }
        });
    }

    return trades;
}


function getTradesByUser(req, res) {
    const { userId } = req.params;
    let trades = getUserTrades(userId);
    res.json({ trades: trades });
}


function getTradesVersionByUser(req, res) {
    const { userId } = req.params;
    let trades = getUserTrades(userId, false);
    res.json({ versionstamp: trades.reduce((highest, trade) => Math.max(trade.versionstamp, highest), 0) });
}


function getTrades(req, res) {
    let trades = getUserTrades(req.user._id);
    res.json({ trades: trades });
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

function getTradeVersion(req, res) {
    try {
        const { tradeId } = req.params;
        let trade = findTrade(tradeId);
        checkTradeExists(trade);
        checkUserIsPartOfTrade(trade, req.user);

        res.json({ versionstamp: trade.versionstamp });
    } catch(e) {
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
        handleError(e, res);
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

function getArticleOwners(articles, user) {
    let articleOwners = [];

    articles.forEach(article => {
        if ((article.owner !== user) && (articleOwners.indexOf(article.owner) < 0)) {
            articleOwners.push(article.owner);
        }
    });

    return articleOwners;
}

function saveAndSendTrade(trade, res, skipSave = false) {
    if (skipSave) {
        res.json({ trade: trade });
    } else {
        dataCache.saveTrade(trade)
            .then(newTrade => {
                res.json({ trade: newTrade });
            })
            .catch(err => { res.status(500).json(err); });
    }
}

function handleError(e, res) {
    if (e instanceof ParameterValidationError) {
        res.status(e.statusCode).json(e.message);
    } else {
        res.status(500).json(e);
    }
}

function checkTradeExists(trade) {
    if (!trade) {
        throw new ParameterValidationError(404, `The specified trade does not exist`);
    }
}

function checkUserIsPartOfTrade(trade, user) {
    if ((trade.user1 !== user) && (trade.user2 !== user)) {
        throw new ParameterValidationError(400, 'Only trade partners can modify the trade');
    }
}

function checkTradeIsCompleted(trade) {
    if (trade.state !== TradeState.TRADE_STATE_COMPLETED) {
        throw new ParameterValidationError(403, 'Delivered can only be set on a completed trade');
    }
}

// Valid states
const validStates = ['ACCEPTED', 'CANCELED', 'DECLINED', 'DELIVERED', 'REQUESTED'];

function checkNewStateIsValid(value) {
    if (validStates.indexOf(value.toUpperCase()) < 0) {
        throw new ParameterValidationError(400, `The given state [${value}] is not recognized`);
    }
}

module.exports = {
    addTrade,
    deleteTrade,
    getNewTrade,
    getTrade,
    getTrades,
    getTradesByUser,
    getTradesVersionByUser,
    getTradeVersion,
    setTradeArticles,
    setTradeState,
};
