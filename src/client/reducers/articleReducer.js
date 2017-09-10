import { ARTICLE_FETCHED } from './../actions/actions';

const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
            return theAction.article;
        default:
            return theState;
    }
}
