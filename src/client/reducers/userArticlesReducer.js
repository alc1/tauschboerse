import { SET_USER_ARTICLES } from './../actions/actions';

export default function userArticles(theState = [], theAction) {
    switch (theAction.type) {
        case SET_USER_ARTICLES:
            return theAction.userArticles;
        default:
            return theState;
    }
}
