import axios from 'axios';

import { handleError } from './common';
import TradeModel from '../../model/TradeModel';

import { getChosenPartnerArticles, getChosenUserArticles, getTrade } from '../selectors/trade.js';
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
export const TRADE_ARTICLE_FILTER_TEXT_SET = 'TRADE_ARTICLE_FILTERTEXT_SET';
export const TRADE_EDITOR_INITIALISED = 'TRADE_EDITOR_INITIALISED';

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

export const loadNewTrade = (theArticleId) => (dispatch, getState) => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/new/${theArticleId}`)
        .then(
            response => dispatch(tradeFetched(new TradeModel(response.data.trade, getUser(getState()))))
         )
        .catch((err) => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
};

export const loadUserArticles = () => (dispatch, getState) => {
    return loadArticlesByUserId(getUser(getState())._id, true, dispatch);
};

export const loadPartnerArticles = () => (dispatch, getState) => {
    let currentState = getState();
    let trade = getTrade(currentState);
    return loadArticlesByUserId(trade.tradePartner._id, false, dispatch);
};

export const saveTrade = () => (dispatch, getState) => {
    let currentState = getState();
    let articles = getChosenUserArticles(currentState).concat(getChosenPartnerArticles(currentState)).map(a => a._id);
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

export const toggleUserArticle = (theArticle) => dispatch => {
    dispatch(articleToggled(theArticle, true));
};

export const togglePartnerArticle = (theArticle) => dispatch => {
    dispatch(articleToggled(theArticle, false));
};

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

export const setStepIndex = (theStepIndex) => (dispatch) => {
    return dispatch(stepIndexSet(theStepIndex));
}

export const initTradeEditor = () => (dispatch) => {
    return dispatch(tradeEditorInitialised());
}

export const setUserArticleFilterText = (theText) => (dispatch) => {
    return dispatch(articleFilterTextSet(theText, true));
}

export const setPartnerArticleFilterText = (theText) => (dispatch) => {
    return dispatch(articleFilterTextSet(theText, false));
}

function setTradeState(theNewTradeState, dispatch, getState) {
    let currentState = getState();
    let trade = getTrade(currentState);
    let user = getUser(currentState);

    return axios.post(`/api/trades/${trade._id}/state`, { state: theNewTradeState })
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, user))))
        .catch(err => handleError(err, dispatch));
}

function loadArticlesByUserId(theUserId, forUser, dispatch) {
    return axios.get(`/api/users/${theUserId}/articles?onlyAvailable=1`)
        .then(response => dispatch(articlesFetched(response.data.articles, forUser)))
        .catch(err => handleError(err, dispatch));
}
