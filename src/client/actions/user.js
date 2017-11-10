import axios from 'axios';
import jwt from 'jsonwebtoken';

import { JWT_TOKEN_KEY } from '../common';

/*
 * Action Type Constants
 */

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_CREATED = 'USER_CREATED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_ARTICLES_FETCHED = 'USER_ARTICLES_FETCHED';

/*
 * Action Creators
 */

export const userLoggedIn = (theUser) => ({
    type: USER_LOGGED_IN,
    user: theUser
});

const userLoggedOut = () => ({
    type: USER_LOGGED_OUT
});

const userCreated = (theUser) => ({
    type: USER_CREATED,
    user: theUser
});

const userUpdated = (theUser) => ({
    type: USER_UPDATED,
    user: theUser
});

const userArticlesFetched = (theArticles) => ({
    type: USER_ARTICLES_FETCHED,
    articles: theArticles
});

/*
 * Thunk Actions
 */

export const login = (user, credentials) => dispatch =>
    axios.post('/api/users/auth', { user, credentials })
        .then(response => onTokenReceived(response.data.token, dispatch, userLoggedIn));

export const logout = () => dispatch => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    dispatch(userLoggedOut());
};

export const createUser = (user, credentials) => dispatch =>
    axios.post('/api/users', { user, credentials })
        .then(response => onTokenReceived(response.data.token, dispatch, userCreated));

export const updateUser = (user, credentials) => dispatch =>
    axios.put(`/api/users/${user._id}`, { user, credentials })
        .then(response => onTokenReceived(response.data.token, dispatch, userUpdated));

export const loadUserArticles = (theUserId) => dispatch =>
    axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(userArticlesFetched(response.data.articles)));

/*
 * Actions
 */

const onTokenReceived = (token, dispatch, actionCreator) => {
    localStorage.setItem(JWT_TOKEN_KEY, token);
    setToken(token, dispatch, actionCreator);
};

export const setToken = (token, dispatch, actionCreator) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const user = jwt.decode(token);
    dispatch(actionCreator(user));
};
