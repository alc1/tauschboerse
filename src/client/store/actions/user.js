import axios from 'axios';
import jwt from 'jsonwebtoken';

import { globalMessageReceived, OK_MESSAGE, pageSizeChanged } from './application';
import { JWT_TOKEN_KEY, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { handleError } from './common';
import { setApiToken, removeApiToken } from '../../utils/serverApi';
import { getUser } from '../selectors/user';
import TradesModel from '../../model/TradesModel';

/*
 * Action Type Constants
 */

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_CREATED = 'USER_CREATED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_ARTICLES_FETCHED = 'USER_ARTICLES_FETCHED';
export const USER_TRADES_FETCHED = 'USER_TRADES_FETCHED';
export const USER_TRADES_VERSION_FETCHED = 'USER_TRADES_VERSION_FETCHED';
export const USER_ARTICLES_FILTERED = 'USER_ARTICLES_FILTERED';
export const USER_TRADES_SECTION_OPENED = 'USER_TRADES_SECTION_OPENED';

/*
 * Action Creators
 */

export const userLoggedIn = (theUser) => ({
    type: USER_LOGGED_IN,
    user: theUser
});

export const userLoggedOut = () => ({
    type: USER_LOGGED_OUT
});

export const userCreated = (theUser) => ({
    type: USER_CREATED,
    user: theUser
});

export const userUpdated = (theUser) => ({
    type: USER_UPDATED,
    user: theUser
});

export const userArticlesFetched = (theArticles) => ({
    type: USER_ARTICLES_FETCHED,
    articles: theArticles
});

export const userTradesFetched = (theTrades) => ({
    type: USER_TRADES_FETCHED,
    trades: theTrades
});

export const userTradesVersionFetched = (theVersionstamp) => ({
    type: USER_TRADES_VERSION_FETCHED,
    versionstamp: theVersionstamp
});

export const userArticlesFiltered = (theFilterText, theFilterStatus) => ({
    type: USER_ARTICLES_FILTERED,
    filterText: theFilterText,
    filterStatus: theFilterStatus
});

const userTradesSectionOpened = (theUserTradesSectionIndex) => ({
    type: USER_TRADES_SECTION_OPENED,
    userTradesSectionIndex: theUserTradesSectionIndex
});

/*
 * Thunk Actions
 */

export const login = (user) => dispatch =>
    axios.post('/api/users/auth', { user })
        .then(response => {
            onTokenReceived(response.data.token, dispatch, userLoggedIn);
            // apply user settings
            dispatch(pageSizeChanged(response.data.user.pageSize));
        })
        .catch(err => handleError(err, dispatch));

export const logout = () => dispatch => {
    removeToken(dispatch, true);
    // apply system default settings
    dispatch(pageSizeChanged(DEFAULT_PAGE_SIZE));
};

export const createUser = (user) => dispatch =>
    axios.post('/api/users', { user })
        .then(response => onTokenReceived(response.data.token, dispatch, userCreated))
        .catch(err => handleError(err, dispatch));

export const updateUser = (user) => dispatch =>
    axios.put(`/api/users/${user._id}`, { user })
        .then(response => onTokenReceived(response.data.token, dispatch, userUpdated))
        .catch(err => handleError(err, dispatch));

export const loadUserArticles = () => (dispatch, getState) => {
    let user = getUser(getState());

    return axios.get(`/api/users/${user._id}/articles`)
        .then(response => dispatch(userArticlesFetched(response.data.articles)))
        .catch(err => handleError(err, dispatch));
};

export const loadUserTrades = () => (dispatch, getState) => {
    let user = getUser(getState());

    return axios.get(`/api/users/${user._id}/trades`)
        .then(response => dispatch(userTradesFetched(new TradesModel(response.data.trades, user))))
        .catch(err => handleError(err, dispatch));
}

export const checkForNewTrades = () => (dispatch, getState) => {
    let user = getUser(getState());

    return axios.get(`/api/users/${user._id}/trades/version`, { headers: { 'x-no-set-loading': true }})
        .then(response => dispatch(userTradesVersionFetched(response.data.versionstamp)))
        .catch(err => handleError(err, dispatch));
}

export const filterUserArticles = (theFilterText, theFilterStatus) => dispatch =>
    dispatch(userArticlesFiltered(theFilterText, theFilterStatus));

export const openUserTradesSection = (theUserTradesSectionIndex) => dispatch =>
    dispatch(userTradesSectionOpened(theUserTradesSectionIndex));

/*
 * Actions
 */

const onTokenReceived = (token, dispatch, actionCreator) => {
    localStorage.setItem(JWT_TOKEN_KEY, token);
    sessionStorage.setItem(JWT_TOKEN_KEY, token);
    setToken(token, dispatch, actionCreator);
};

export const setToken = (token, dispatch, actionCreator) => {
    setApiToken(token);
    const user = jwt.decode(token);
    dispatch(actionCreator(user));
};

export const removeToken = (dispatch, showLogoutMessage) => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    sessionStorage.removeItem(JWT_TOKEN_KEY);
    removeApiToken();
    dispatch(userLoggedOut());
    if (showLogoutMessage) {
        dispatch(globalMessageReceived({
            messageText: 'Erfolgreich abgemeldet.',
            messageType: OK_MESSAGE
        }));
    }
};
