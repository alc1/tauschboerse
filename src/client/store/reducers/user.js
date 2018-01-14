import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_CREATED,
    USER_UPDATED,
    USER_ARTICLES_FETCHED,
    USER_TRADES_FETCHED,
    USER_ARTICLES_FILTERED,
    USER_TRADES_SECTION_OPENED
} from '../actions/user';

import {
    ARTICLE_FETCHED,
    ARTICLE_UPDATED,
    ARTICLE_DELETED
} from '../actions/article';

import {
    PAGE_SIZE_CHANGED
} from '../actions/application';

export const initialState = null;

export default function user(theState = initialState, theAction) {
    switch (theAction.type) {
        case USER_LOGGED_IN:
        case USER_CREATED:
        case USER_UPDATED:
            return {
                ...theState,
                user: theAction.user
            };
        case USER_LOGGED_OUT:
            return initialState;
        case USER_ARTICLES_FETCHED:
            return {
                ...theState,
                articles: theAction.articles
            };
        case USER_TRADES_FETCHED:
            return {
                ...theState,
                trades: theAction.trades
            };
        case ARTICLE_FETCHED:
        case ARTICLE_UPDATED:
            if (theState === initialState) {
                return initialState;
            }
            return {
                ...theState,
                articles: theState.articles ? theState.articles.map(article => (article._id === theAction.article._id) ? theAction.article : article) : []
            };
        case ARTICLE_DELETED:
            if (theState === initialState) {
                return initialState;
            }
            return {
                ...theState,
                articles: theState.articles ? theState.articles.filter(article => article._id !== theAction.articleId) : []
            };
        case USER_ARTICLES_FILTERED:
            return {
                ...theState,
                userArticlesFilter: {
                    filterText: theAction.filterText,
                    filterStatus: theAction.filterStatus
                }
            };
        case USER_TRADES_SECTION_OPENED:
            return {
                ...theState,
                userTradesSectionIndex: theAction.userTradesSectionIndex
            };
        case PAGE_SIZE_CHANGED:
            if (theState === initialState) {
                return initialState;
            }

            let newSettings;
            if (typeof theState.settings === 'undefined') {
                newSettings = {
                    pageSize: theAction.pageSize
                };
            } else {
                newSettings = {
                    ...theState.settings,
                    pageSize: theAction.pageSize
                };
            }

            return {
                ...theState,
                settings: newSettings
            };
        default:
            return theState;
    }
}
