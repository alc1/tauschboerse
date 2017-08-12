import { SET_ARTICLE } from './../actions/actions';

export default function articleDetail(theState = null, theAction) {
    switch (theAction.type) {
        case SET_ARTICLE:
            return theAction.article;
        default:
            return theState;
    }
}
