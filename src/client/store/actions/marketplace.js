import axios from 'axios';

import { handleError } from './common';

/*
 * Action Type Constants
 */

export const ARTICLES_FOUND = 'ARTICLES_FOUND';
export const LAST_SEARCH_CLEARED = 'LAST_SEARCH_CLEARED';
export const MARKETPLACE_SECTION_OPENED = 'MARKETPLACE_SECTION_OPENED';

/*
 * Action Creators
 */

export const articlesFound = (theSearchText, theArticles, theUserArticles) => ({
    type: ARTICLES_FOUND,
    text: theSearchText,
    articles: theArticles,
    userArticles: theUserArticles
});

export const lastSearchCleared = () => ({
    type: LAST_SEARCH_CLEARED
});

export const marketplaceSectionOpened = (theMarketplaceSectionIndex) => ({
    type: MARKETPLACE_SECTION_OPENED,
    marketplaceSectionIndex: theMarketplaceSectionIndex
});

/*
 * Thunk Actions
 */

export const findArticles = (theSearchText, theVersion) => dispatch => {
    return axios.get(`/api/articles?text=${theSearchText}`)
        .then(response => dispatch(articlesFound(theSearchText, response.data.articles, response.data.userArticles)))
        .catch((err) => handleError(err, dispatch));
};

export const clearLastSearch = () => dispatch =>
    dispatch(lastSearchCleared());

export const openMarketplaceSection = (theMarketplaceSectionIndex) => dispatch =>
    dispatch(marketplaceSectionOpened(theMarketplaceSectionIndex));