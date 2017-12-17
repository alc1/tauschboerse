import {
    ARTICLE_FETCHED,
    ARTICLE_CREATED,
    ARTICLE_UPDATED,
    ARTICLE_DELETED,
    REMOVE_SELECTED_ARTICLE
} from '../actions/article';

export const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
        case ARTICLE_CREATED:
        case ARTICLE_UPDATED:
            return theAction.article;
        case ARTICLE_DELETED:
            if (theState && theState._id === theAction.articleId) {
                return initialState;
            }
            return theState;
        case REMOVE_SELECTED_ARTICLE:
            return initialState;
        default:
            return theState;
    }
}
