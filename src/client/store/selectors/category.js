import { CATEGORIES_SLICE_NAME } from '../slices';

export const getCategories = (theState) => {
    return theState[CATEGORIES_SLICE_NAME] || [];
};
