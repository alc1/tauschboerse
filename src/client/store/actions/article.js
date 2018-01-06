import axios from 'axios';

import { handleError } from './common';
import { getUser } from '../selectors/user';

import TradesModel from '../../model/TradesModel';

/*
 * Action Type Constants
 */

export const ARTICLE_FETCHED = 'ARTICLE_FETCHED';
export const ARTICLE_CREATED = 'ARTICLE_CREATED';
export const ARTICLE_UPDATED = 'ARTICLE_UPDATED';
export const ARTICLE_DELETED = 'ARTICLE_DELETED';
export const REMOVE_SELECTED_ARTICLE = 'REMOVE_SELECTED_ARTICLE';

/*
 * Action Creators
 */

export const articleFetched = (theArticle) => ({
    type: ARTICLE_FETCHED,
    article: theArticle
});

export const articleCreated = (theArticle) => ({
    type: ARTICLE_CREATED,
    article: theArticle
});

export const articleUpdated = (theArticle) => ({
    type: ARTICLE_UPDATED,
    article: theArticle
});

export const articleDeleted = (theArticleId) => ({
    type: ARTICLE_DELETED,
    articleId: theArticleId
});

export const selectedArticleRemoved = () => ({
    type: REMOVE_SELECTED_ARTICLE
});

/*
 * Thunk Actions
 */

export const loadArticle = (theArticleId) => (dispatch, getState) =>
    axios.get(`/api/articles/${theArticleId}`)
        .then(response => dispatch(articleFetched(extendArticleWithTrades(response.data.article, response.data.trades, getUser(getState())))))
        .catch((err) => handleError(err, dispatch));

export const createArticle = (article) => dispatch =>
    axios.post('/api/articles', { article })
        .then(response => dispatch(articleCreated(response.data.article)))
        .catch((err) => handleError(err, dispatch));

export const updateArticle = (ownerId, article) => (dispatch, getState) =>
    axios.put(`/api/users/${ownerId}/articles/${article._id}`, { article })
        .then(response => dispatch(articleUpdated(extendArticleWithTrades(response.data.article, response.data.trades, getUser(getState())))))
        .catch((err) => handleError(err, dispatch));

export const deleteArticle = (ownerId, articleId) => (dispatch, getState) =>
    axios.delete(`/api/users/${ownerId}/articles/${articleId}`)
        .then(response => {
            if (response.data.isDeleted) {
                if (response.data.articleId) {
                    dispatch(articleDeleted(response.data.articleId));
                }
                else if (response.data.article) {
                    dispatch(articleUpdated(extendArticleWithTrades(response.data.article, response.data.trades, getUser(getState()))));
                }
            }
        })
        .catch((err) => handleError(err, dispatch));

export const removeSelectedArticle = () => dispatch => {
    dispatch(selectedArticleRemoved());
};

const extendArticleWithTrades = (theArticle, theTrades, theUser) => {
    let article = theArticle;
    if (theTrades) {
        article.trades = new TradesModel(theTrades, theUser);
    }
    return article;
};