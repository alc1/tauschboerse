import axios from 'axios';
import jwt from 'jsonwebtoken';

import { JWT_TOKEN_KEY } from '../common';

/*
 * Action Type Constants
 */

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
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

const userArticlesFetched = (theArticles) => ({
    type: USER_ARTICLES_FETCHED,
    articles: theArticles
});

/*
 * Actions
 */

export const login = (email, password) => dispatch =>
    axios.post('/api/users/auth', { credentials: { email, password }})
        .then(response => {
            const token = response.data.token;
            localStorage.setItem(JWT_TOKEN_KEY, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const user = jwt.decode(token);
            dispatch(userLoggedIn(user));
        });

export const logout = () => dispatch => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    dispatch(userLoggedOut());
};

export const loadUserArticles = (theUserId) => dispatch =>
    axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(userArticlesFetched(response.data.articles)));
