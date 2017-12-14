import { MARKETPLACE_SLICE_NAME } from '../store/slices';

export const getLastSearch = (theState) => {
    return theState[MARKETPLACE_SLICE_NAME].lastSearch;
};

export const getTrade = (theState) => {
    return theState[MARKETPLACE_SLICE_NAME].trade;
};
