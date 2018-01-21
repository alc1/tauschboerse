import axios from 'axios';

import { handleError } from './common';
import { dispatchGlobalInfoMessage, dispatchGlobalWarningMessage, loadingStateReceived } from './application';
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
        .catch(err => handleError(err, dispatch));

export const createArticle = (article, photos) => dispatch => {
    dispatch(loadingStateReceived(true));
    return axios.post('/api/articles', { article })
        .then(async articleResponse => {
            if (photos.length > 0) {
                let lastSuccessfulResult;
                let failedPhotos = [];
                for (let photo of photos) {
                    let currentResult = await handlePromiseErrorAsNull(axios.post(`/api/articles/${articleResponse.data.article._id}/photos`, { photo }));
                    if (currentResult) {
                        lastSuccessfulResult = currentResult;
                    }
                    else {
                        failedPhotos.push(photo.fileName);
                    }
                }
                if (failedPhotos.length > 0) {
                    dispatchSavedWithWarningsMessage(dispatch, failedPhotos);
                }
                else {
                    dispatchSuccessfullySavedMessage(dispatch);
                }
                if (lastSuccessfulResult) {
                    return dispatch(articleCreated(lastSuccessfulResult.data.article));
                }
                else {
                    return dispatch(articleCreated(articleResponse.data.article));
                }
            }
            else {
                dispatchSuccessfullySavedMessage(dispatch);
                return dispatch(articleCreated(articleResponse.data.article));
            }
        })
        .then(response => {
            dispatch(loadingStateReceived(false));
            return response;
        })
        .catch(err => {
            dispatch(loadingStateReceived(false));
            handleError(err, dispatch);
        });
};

export const updateArticle = (article, addedPhotos, removedPhotos) => (dispatch, getState) => {
    dispatch(loadingStateReceived(true));
    return axios.put(`/api/articles/${article._id}`, { article })
        .then(async articleResponse => {
            if (addedPhotos.length > 0 || removedPhotos.length > 0) {
                let lastSuccessfulResult;
                let failedPhotos = [];
                for (let photo of addedPhotos) {
                    let currentResult = await handlePromiseErrorAsNull(axios.post(`/api/articles/${article._id}/photos`, { photo }));
                    if (currentResult) {
                        lastSuccessfulResult = currentResult;
                    }
                    else {
                        failedPhotos.push(photo.fileName);
                    }
                }
                for (let photo of removedPhotos) {
                    let currentResult = await handlePromiseErrorAsNull(axios.delete(`/api/articles/${article._id}/photos/${photo.fileName}`, { photo }));
                    if (currentResult) {
                        lastSuccessfulResult = currentResult;
                    }
                    else {
                        failedPhotos.push(photo.fileName);
                    }
                }
                if (failedPhotos.length > 0) {
                    dispatchSavedWithWarningsMessage(dispatch, failedPhotos);
                }
                else {
                    dispatchSuccessfullySavedMessage(dispatch);
                }
                if (lastSuccessfulResult) {
                    return dispatch(articleUpdated(extendArticleWithTrades(lastSuccessfulResult.data.article, lastSuccessfulResult.data.trades, getUser(getState()))));
                }
                else {
                    return dispatch(articleUpdated(extendArticleWithTrades(articleResponse.data.article, articleResponse.data.trades, getUser(getState()))));
                }
            }
            else {
                dispatchSuccessfullySavedMessage(dispatch);
                return dispatch(articleUpdated(extendArticleWithTrades(articleResponse.data.article, articleResponse.data.trades, getUser(getState()))));
            }
        })
        .then(response => {
            dispatch(loadingStateReceived(false));
            return response;
        })
        .catch(err => {
            dispatch(loadingStateReceived(false));
            handleError(err, dispatch);
        });
};

export const deleteArticle = (articleId) => (dispatch, getState) =>
    axios.delete(`/api/articles/${articleId}`)
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
        .catch(err => handleError(err, dispatch));

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

const handlePromiseErrorAsNull = async (theRequestPromise) => {
    try {
        return await theRequestPromise;
    } catch (error) {
        return null;
    }
};

const dispatchSavedWithWarningsMessage = (dispatch, failedPhotos) => {
    dispatchGlobalWarningMessage(dispatch, 'Folgende Bilder konnten nicht gespeichert werden:\n' + failedPhotos.join('\n'));
};

const dispatchSuccessfullySavedMessage = (dispatch) => {
    dispatchGlobalInfoMessage(dispatch, 'Artikel wurde gespeichert.');
};
