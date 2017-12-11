import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_CREATED,
    USER_UPDATED,
    USER_ARTICLES_FETCHED,
    USER_TRADES_FETCHED
} from './../actions/user';

import {
    ARTICLE_DELETED
} from './../actions/article';

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
        case ARTICLE_DELETED:
            if (theState === initialState) {
                return initialState;
            }
            return {
                ...theState,
                articles: theState.articles.filter(article => article._id !== theAction.articleId)
            };
        default:
            return theState;
    }
}
