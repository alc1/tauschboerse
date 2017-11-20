import {
    ARTICLE_FETCHED,
    ARTICLE_CREATED,
    ARTICLE_UPDATED,
    ARTICLE_DELETED
} from './../actions/article';

const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
        case ARTICLE_CREATED:
        case ARTICLE_UPDATED:
            return theAction.article;
        case ARTICLE_DELETED:
            if (theState._id === theAction.articleId) {
                return initialState;
            }
            return theState;
        default:
            return theState;
    }
}
