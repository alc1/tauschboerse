import axios from 'axios';

import { handleError } from './common';
import TradeModel from '../../model/TradeModel';

import { getPartnerArticlesInfo, getTrade, getUserArticlesInfo } from '../selectors/trade.js';
import { getUser } from '../selectors/user';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_FETCHING = 'TRADE_FETCHING';
export const TRADE_NOT_FOUND = 'TRADE_NOT_FOUND';
export const TRADE_DELETED = 'TRADE_DELETED';
export const TRADE_ARTICLES_SAVED = 'TRADE_ARTICLES_SAVED';
export const TRADE_ARTICLES_FETCHED = 'TRADE_ARTICLES_FETCHED';
export const TRADE_ARTICLE_TOGGLED = 'TRADE_ARTICLE_TOGGLED';
export const TRADE_STEP_INDEX_SET = 'TRADE_STEP_INDEX_SET';
export const TRADE_PAGE_NUM_SET = 'TRADE_PAGE_NUM_SET';
export const TRADE_ARTICLE_FILTER_TEXT_SET = 'TRADE_ARTICLE_FILTERTEXT_SET';
export const TRADE_EDITOR_INITIALISED = 'TRADE_EDITOR_INITIALISED';
export const TRADE_NEW_VERSION_AVAILABLE = 'TRADE_NEW_VERSION_AVAILABLE';
export const TRADE_RELOAD = 'TRADE_RELOAD';

/*
 * Action Creators
 */

export const tradeFetched = (theTrade) => ({
    type: TRADE_FETCHED,
    trade: theTrade,
});

export const tradeIsBeingFetched = () => ({
    type: TRADE_FETCHING
});

export const tradeNotFound = () => ({
    type: TRADE_NOT_FOUND
});

export const newTradeVersionAvailable = () => ({
    type: TRADE_NEW_VERSION_AVAILABLE
});

export const reloadTradeReceived = () => ({
    type: TRADE_RELOAD
});

export const tradeDeleted = () => ({
    type: TRADE_DELETED
});

export const articlesFetched = (theArticles, forUser) => ({
    type: TRADE_ARTICLES_FETCHED,
    forUser: forUser,
    articles: theArticles
});

export const articleToggled = (theArticle, forUser) => ({
    type: TRADE_ARTICLE_TOGGLED,
    forUser: forUser,
    article: theArticle
});

export const stepIndexSet = (stepIndex) => ({
    type: TRADE_STEP_INDEX_SET,
    stepIndex: stepIndex
});

export const pageNumSet = (val, forUser) => ({
    type: TRADE_PAGE_NUM_SET,
    forUser: forUser,
    pageNum: val
});

export const tradeEditorInitialised = () => ({
    type: TRADE_EDITOR_INITIALISED
});

export const articleFilterTextSet = (theText, forUser) => ({
    type: TRADE_ARTICLE_FILTER_TEXT_SET,
    forUser: forUser,
    text: theText
});

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId) => (dispatch, getState) => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, getUser(getState())))))
        .catch(err => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
};

export const checkForUpdatedTrade = () => (dispatch, getState) => {
    let trade = getTrade(getState());

    // Paranoia: if no trade in the store don't attempt to check for new versions!
    if (trade) {
        return axios.get(`/api/trades/${trade._id}/version`, { headers: { 'x-no-set-loading': true }})
            .then(response => {
                if (trade.isOutOfDate(response.data.versionstamp)) {
                    dispatch(newTradeVersionAvailable());
                }
            });
    } else {
        return Promise.resolve(false);
    }
};

export const sendReloadTrade = () => (dispatch) => dispatch(reloadTradeReceived());

export const loadNewTrade = (theArticleId) => (dispatch, getState) => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/new/${theArticleId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, getUser(getState())))))
        .catch((err) => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
};

export const loadUserArticles = () => (dispatch, getState) => loadArticlesByUserId(true, getUser(getState())._id, dispatch);

export const loadPartnerArticles = () => (dispatch, getState) => {
    let currentState = getState();
    let trade = getTrade(currentState);
    return loadArticlesByUserId(false, trade.tradePartner._id, dispatch);
};

export const saveTrade = () => (dispatch, getState) => {
    let currentState = getState();
    let articles = getUserArticlesInfo(currentState).chosenArticles.concat(getPartnerArticlesInfo(currentState).chosenArticles).map(a => a._id);
    let trade = getTrade(currentState);
    let user = getUser(currentState);

    let op;
    let body = { articleIds: articles };
    if (trade.exists) {
        op = axios.post(`/api/trades/${trade._id}/articles`, body);
    } else {
        op = axios.post(`/api/trades/`, body);
    }

    return op
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, user))))
        .catch(err => handleError(err, dispatch));
};

export const deleteTrade = () => (dispatch, getState) => {
    let currentState = getState();
    let trade = getTrade(currentState);
    let user = getUser(currentState);

    return axios.delete(`/api/trades/${trade._id}`)
        .then(response => dispatch(response.data.trade ? tradeFetched(new TradeModel(response.data.trade, user)) : tradeDeleted()))
        .catch(err => handleError(err, dispatch))
};

export const submitTrade = () => (dispatch, getState) => setTradeState('REQUESTED', dispatch, getState);

export const withdrawTrade = () => (dispatch, getState) => setTradeState('CANCELED', dispatch, getState);

export const acceptTrade = () => (dispatch, getState) => setTradeState('ACCEPTED', dispatch, getState);

export const declineTrade = () => (dispatch, getState) => setTradeState('DECLINED', dispatch, getState);

export const setDelivered = () => (dispatch, getState) => setTradeState('DELIVERED', dispatch, getState);

export const setStepIndex = (theStepIndex) => (dispatch) => dispatch(stepIndexSet(theStepIndex));

export const toggleArticle = (forUser, theArticle) => dispatch => dispatch(articleToggled(theArticle, forUser));

export const setPageNum = (forUser, thePageNum) => (dispatch) => dispatch(pageNumSet(thePageNum, forUser));

export const setFilterText = (forUser, theText) => (dispatch) => dispatch(articleFilterTextSet(theText, forUser));

export const initTradeEditor = () => (dispatch) => dispatch(tradeEditorInitialised());

function setTradeState(theNewTradeState, dispatch, getState) {
    let currentState = getState();
    let trade = getTrade(currentState);
    let user = getUser(currentState);

    return axios.post(`/api/trades/${trade._id}/state`, { state: theNewTradeState })
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, user))))
        .catch(err => handleError(err, dispatch));
}

function loadArticlesByUserId(forUser, theUserId, dispatch) {
    return axios.get(`/api/users/${theUserId}/articles?onlyAvailable=1`)
        .then(response => dispatch(articlesFetched(response.data.articles, forUser)))
        .catch(err => handleError(err, dispatch));
}
