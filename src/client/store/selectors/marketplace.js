import { MARKETPLACE_SLICE_NAME } from '../slices';

export const getLastSearch = (theState) => theState[MARKETPLACE_SLICE_NAME].lastSearch;

export const getTrade = (theState) => theState[MARKETPLACE_SLICE_NAME].trade;

export const getMarketplaceSectionIndex = (theState) => theState[MARKETPLACE_SLICE_NAME].marketplaceSectionIndex;
