import { CATEGORIES_SLICE_NAME } from '../store/slices';

export const getCategories = (theState) => {
    return theState[CATEGORIES_SLICE_NAME] || [];
};
