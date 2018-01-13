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

/*
 * Action Creators
 */

const tradeFetched = (theTrade) => ({
    type: TRADE_FETCHED,
    trade: theTrade,
});

const tradeIsBeingFetched = () => ({
    type: TRADE_FETCHING
});

const tradeNotFound = () => ({
    type: TRADE_NOT_FOUND
});

const newTradeVersionAvailable = () => ({
    type: TRADE_NEW_VERSION_AVAILABLE
});

const tradeDeleted = () => ({
    type: TRADE_DELETED
});

const articlesFetched = (theArticles, forUser) => ({
    type: TRADE_ARTICLES_FETCHED,
    forUser: forUser,
    articles: theArticles
});

const articleToggled = (theArticle, forUser) => ({
    type: TRADE_ARTICLE_TOGGLED,
    forUser: forUser,
    article: theArticle
});

const stepIndexSet = (stepIndex) => ({
    type: TRADE_STEP_INDEX_SET,
    stepIndex: stepIndex
});

const pageNumSet = (val, forUser) => ({
    type: TRADE_PAGE_NUM_SET,
    forUser: forUser,
    pageNum: val
});

const tradeEditorInitialised = () => ({
    type: TRADE_EDITOR_INITIALISED
});

const articleFilterTextSet = (theText, forUser) => ({
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

    axios.get(`/api/trades/${trade._id}/version`, { headers: { 'x-no-set-loading': true }})
        .then(response => {
            if (trade.isOutOfDate(response.data.versionstamp)) {
                dispatch(newTradeVersionAvailable());
            }
        })
        .catch((err) => {
            // not important, just ignore it
            console.log(err);
        });
}

export const loadNewTrade = (theArticleId) => (dispatch, getState) => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/new/${theArticleId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, getUser(getState())))))
        .catch((err) => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
};

export const loadUserArticles = () => (dispatch, getState) => {
    return loadArticlesByUserId(true, getUser(getState())._id, dispatch);
};

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
    let trade = getTrade(getState());
    return axios.delete(`/api/trades/${trade._id}`)
        .then(response => dispatch(tradeDeleted()))
        .catch(err => handleError(err, dispatch))
}

export const submitTrade = () => (dispatch, getState) => {
    return setTradeState('REQUESTED', dispatch, getState);
};

export const withdrawTrade = () => (dispatch, getState) => {
    return setTradeState('CANCELED', dispatch, getState);
};

export const acceptTrade = () => (dispatch, getState) => {
    return setTradeState('ACCEPTED', dispatch, getState);
};

export const declineTrade = () => (dispatch, getState) => {
    return setTradeState('DECLINED', dispatch, getState);
};

export const setDelivered = () => (dispatch, getState) => {
    return setTradeState('DELIVERED', dispatch, getState);
}

export const setStepIndex = (theStepIndex) => (dispatch) => {
    return dispatch(stepIndexSet(theStepIndex));
};

export const toggleArticle = (forUser, theArticle) => dispatch => {
    dispatch(articleToggled(theArticle, forUser));
};

export const setPageNum = (forUser, thePageNum) => (dispatch) => {
    return dispatch(pageNumSet(thePageNum, true));
};

export const setFilterText = (forUser, theText) => (dispatch) => {
    return dispatch(articleFilterTextSet(theText, forUser));
};

export const initTradeEditor = () => (dispatch) => {
    return dispatch(tradeEditorInitialised());
};

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
