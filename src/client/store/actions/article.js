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

export const createArticle = (article, photos) => dispatch =>
    axios.post('/api/articles', { article })
        .then(articleResponse => {
            if (photos.length > 0) {
                const allPhotoRequests = photos.map(photo => wrapIgnorablePromise(axios.post(`/api/articles/${articleResponse.data.article._id}/photos`, { photo })));
                return Promise.all(allPhotoRequests)
                    .then(allResponses => {
                        let reverseResponses = allResponses.reverse();
                        for (let lastSuccessfulResponse of reverseResponses) {
                            if (lastSuccessfulResponse) {
                                return dispatch(articleCreated(lastSuccessfulResponse.data.article));
                            }
                        }
                        return dispatch(articleCreated(articleResponse.data.article));
                    });
            }
            else {
                return dispatch(articleCreated(articleResponse.data.article));
            }
        })
        .catch((err) => handleError(err, dispatch));

export const updateArticle = (ownerId, article, addedPhotos, removedPhotos) => (dispatch, getState) =>
    axios.put(`/api/users/${ownerId}/articles/${article._id}`, { article })
        .then(articleResponse => {
            if (addedPhotos.length > 0 || removedPhotos.length > 0) {
                const allPhotoRequests = [
                    ...addedPhotos.map(photo => wrapIgnorablePromise(axios.post(`/api/articles/${article._id}/photos`, { photo }))),
                    ...removedPhotos.map(photo => wrapIgnorablePromise(axios.delete(`/api/articles/${article._id}/photos/${photo.fileName}`, { photo })))
                ];
                return Promise.all(allPhotoRequests)
                    .then(allResponses => {
                        let reverseResponses = allResponses.reverse();
                        for (let lastSuccessfulResponse of reverseResponses) {
                            if (lastSuccessfulResponse) {
                                return dispatch(articleUpdated(extendArticleWithTrades(lastSuccessfulResponse.data.article, lastSuccessfulResponse.data.trades, getUser(getState()))));
                            }
                        }
                        return dispatch(articleUpdated(extendArticleWithTrades(articleResponse.data.article, articleResponse.data.trades, getUser(getState()))));
                    });
            }
            else {
                return dispatch(articleUpdated(extendArticleWithTrades(articleResponse.data.article, articleResponse.data.trades, getUser(getState()))));
            }
        })
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

/*
 * Wraps the given Promise into a Promise which ignores an error. Goal is to use it with Promise.all where
 * one failing Promise must not break the others. In other words it makes a failing Promise to a successful
 * Promise with the return value of null which can be handled later.
 */
function wrapIgnorablePromise(thePromiseToIgnoreIfFailing) {
    return new Promise((resolve, reject) => {
        thePromiseToIgnoreIfFailing
            .then(result => {
                resolve(result);
            })
            .catch((err) => {
                reject(null);
            });
    }).catch((err) => {
        return err;
    });
}
