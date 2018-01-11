import { CATEGORIES_SLICE_NAME } from '../slices';

export const getCategories = (theState) => theState[CATEGORIES_SLICE_NAME] || [];
