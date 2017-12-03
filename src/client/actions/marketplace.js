import axios from 'axios';

import { handleError } from './common';

/*
 * Action Type Constants
 */

export const ARTICLES_FOUND = 'ARTICLES_FOUND';

/*
 * Action Creators
 */

const articlesFound = (theSearchText, theArticles, theVersion) => ({
    type: ARTICLES_FOUND,
    text: theSearchText,
    articles: theArticles,
    version: theVersion
});

/*
 * Thunk Actions
 */

export const findArticles = (theSearchText, theVersion) => dispatch =>
{
    let versionCheckPromise = new Promise((resolve, reject) => {
        if (theVersion) {
            axios.get('/api/articles/version')
                .then(response => {
                    resolve(theVersion === Number(response.data.version));
                })
                .catch(() => resolve(true));
        } else {
            resolve(true);
        }
    });

    let searchPromise = new Promise((resolve, reject) => {
        axios.get(`/api/articles?text=${theSearchText}`)
            .then(response => {
                dispatch(articlesFound(theSearchText, response.data.articles, response.data.version));
                resolve();
            })
            .catch((err) => reject(err));
        });

    return versionCheckPromise
        .then(doSearch => {
            if (doSearch) {
                return searchPromise;
            } else {
                return null;
            }
        })
        .catch((err) => handleError(err));
};
