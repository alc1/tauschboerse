import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_CREATED,
    USER_UPDATED,
    USER_ARTICLES_FETCHED
} from './../actions/user';

const initialState = null;

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
            return {};
        case USER_ARTICLES_FETCHED:
            return {
                ...theState,
                articles: theAction.articles
            };
        default:
            return theState;
    }
}
