import axios from 'axios';

/*
 * Action Type Constants
 */

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const USER_ARTICLES_FETCHED = 'USER_ARTICLES_FETCHED';
export const ARTICLE_FETCHED = 'ARTICLE_FETCHED';

/*
 * Action Creators
 */

const userLoggedIn = (theUser) => ({
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

const articleFetched = (theArticle) => ({
    type: ARTICLE_FETCHED,
    article: theArticle
});

/*
 * Actions
 */

export const login = (email, password) => dispatch =>
    axios.post('/api/users/auth', { email, password })
        .then(response => dispatch(userLoggedIn(response.data.user)));

export const logout = () => dispatch =>
    dispatch(userLoggedOut());

export const loadUserArticles = (theUserId) => dispatch =>
    axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(userArticlesFetched(response.data.articles)));

export const loadArticle = (theArticleId) => dispatch =>
    axios.get(`/api/articles/${theArticleId}`)
        .then(response => dispatch(articleFetched(response.data.article)));
