import {
    CATEGORIES_FETCHED
} from './../actions/category';

export const initialState = [];

export default function category(theState = initialState, theAction) {
    switch (theAction.type) {
        case CATEGORIES_FETCHED:
            return theAction.categories;
        default:
            return theState;
    }
}
