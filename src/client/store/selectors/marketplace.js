import { MARKETPLACE_SLICE_NAME } from '../slices';

export const getLastSearch = (theState) => {
    return theState[MARKETPLACE_SLICE_NAME].lastSearch;
};

export const getTrade = (theState) => {
    return theState[MARKETPLACE_SLICE_NAME].trade;
};

export const getSectionIndex = (theState) => {
    return theState[MARKETPLACE_SLICE_NAME].sectionIndex;
};
