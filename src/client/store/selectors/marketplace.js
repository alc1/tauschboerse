import { MARKETPLACE_SLICE_NAME } from '../slices';

export const getSearchInfo = (theState) => theState[MARKETPLACE_SLICE_NAME].searchInfo;

export const getMarketplaceSectionIndex = (theState) => theState[MARKETPLACE_SLICE_NAME].marketplaceSectionIndex;
