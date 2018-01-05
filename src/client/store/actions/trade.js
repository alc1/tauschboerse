import axios from 'axios';

import { handleError } from './common';
import TradeState from '../../../shared/constants/TradeState';
import TradeModel from '../../model/TradeModel';

import { getChosenPartnerArticles, getChosenUserArticles, getTrade } from '../selectors/trade.js';
import { getUser } from '../selectors/user';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_FETCHING = 'TRADE_FETCHING';
export const TRADE_NOT_FOUND = 'TRADE_NOT_FOUND';
export const TRADE_SAVED = 'TRADE_SAVED';
export const TRADE_ARTICLES_SAVED = 'TRADE_ARTICLES_SAVED';
export const TRADE_STATE_CHANGED = 'TRADE_STATE_CHANGED';
export const TRADE_USER_ARTICLES_FETCHED = 'TRADE_USER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLES_FETCHED = 'TRADE_PARTNER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLE_TOGGLED = 'TRADE_PARTNER_ARTICLE_TOGGLED';
export const TRADE_USER_ARTICLE_TOGGLED = 'TRADE_USER_ARTICLE_TOGGLED';
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

const tradeSaved = (theTrade) => ({
    type: TRADE_SAVED,
    trade: theTrade
});

const articlesSaved = (theTrade) => ({
    type: TRADE_ARTICLES_SAVED,
    trade: theTrade
});

const tradeStateChanged = (theTrade) => ({
    type: TRADE_STATE_CHANGED,
    trade: theTrade
});

const userArticlesFetched = (theArticles) => ({
    type: TRADE_USER_ARTICLES_FETCHED,
    articles: theArticles
});

const partnerArticlesFetched = (theArticles) => ({
    type: TRADE_PARTNER_ARTICLES_FETCHED,
    articles: theArticles
});

const userArticleToggled = (theArticle) => ({
    type: TRADE_USER_ARTICLE_TOGGLED,
    article: theArticle
});

const partnerArticleToggled = (theArticle) => ({
    type: TRADE_PARTNER_ARTICLE_TOGGLED,
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
    return loadArticlesByUserId(getUser(getState())._id, userArticlesFetched, dispatch);
};

export const loadPartnerArticles = () => (dispatch, getState) => {
    let currentState = getState();
    let trade = getTrade(currentState);
    return loadArticlesByUserId(trade.tradePartner._id, partnerArticlesFetched, dispatch);
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
        .then(response => dispatch(tradeFetched(new TradeModel(response.data, user))))
        .catch(err => handleError(err, dispatch));
};

export const toggleUserArticle = (theArticle) => dispatch => {
    dispatch(userArticleToggled(theArticle));
};

export const togglePartnerArticle = (theArticle) => dispatch => {
    dispatch(partnerArticleToggled(theArticle));
};

export const submitTrade = () => (dispatch, getState) => {
    let trade = getTrade(getState());
    return setTradeState(trade, 'REQUESTED', dispatch);
};

export const withdrawTrade = () => (dispatch, getState) => {
    let trade = getTrade(getState());
    
};

export const acceptTrade = () => (dispatch, getState) => {
    let trade = getTrade(getState());
    return setTradeState(trade, 'ACCEPTED', dispatch);
};

export const declineTrade = () => (dispatch, getState) => {
    let trade = getTrade(getState());
    return setTradeState(trade, 'DECLINED', dispatch);
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

function setTradeState(theTrade, theNewState, dispatch) {
    return axios.put(`/api/trades/${theTrade._id}/state`, { newState: theNewState })
        .then(response => dispatch(tradeStateChanged(response.data.trade)))
        .catch(err => handleError(err, dispatch));
}

function loadArticlesByUserId(theUserId, actionCreator, dispatch) {
    return axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(actionCreator(response.data.articles)))
        .catch(err => handleError(err, dispatch));
}
