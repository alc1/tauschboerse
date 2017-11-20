import axios from 'axios';

import { handleError } from './common';

/*
 * Action Type Constants
 */

export const ARTICLE_FETCHED = 'ARTICLE_FETCHED';
export const ARTICLE_CREATED = 'ARTICLE_CREATED';
export const ARTICLE_UPDATED = 'ARTICLE_UPDATED';
export const ARTICLE_DELETED = 'ARTICLE_DELETED';

/*
 * Action Creators
 */

const articleFetched = (theArticle) => ({
    type: ARTICLE_FETCHED,
    article: theArticle
});

const articleCreated = (theArticle) => ({
    type: ARTICLE_CREATED,
    article: theArticle
});

const articleUpdated = (theArticle) => ({
    type: ARTICLE_UPDATED,
    article: theArticle
});

const articleDeleted = (theArticleId) => ({
    type: ARTICLE_DELETED,
    articleId: theArticleId
});

/*
 * Thunk Actions
 */

export const loadArticle = (theArticleId) => dispatch =>
    axios.get(`/api/articles/${theArticleId}`)
        .then(response => dispatch(articleFetched(response.data.article)))
        .catch((err) => handleError(err, dispatch));

export const createArticle = (article) => dispatch =>
    axios.post('/api/articles', { article })
        .then(response => dispatch(articleCreated(response.data.article)))
        .catch((err) => handleError(err, dispatch));

export const updateArticle = (ownerId, article) => dispatch =>
    axios.put(`/api/users/${ownerId}/articles/${article._id}`, { article })
        .then(response => dispatch(articleUpdated(response.data.article)))
        .catch((err) => handleError(err, dispatch));

export const deleteArticle = (ownerId, articleId) => dispatch =>
    axios.delete(`/api/users/${ownerId}/articles/${articleId}`)
        .then(response => dispatch(articleDeleted(response.data.articleId)))
        .catch((err) => handleError(err, dispatch));
