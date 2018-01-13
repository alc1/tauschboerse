import { TRADE_SLICE_NAME } from '../slices';

export const getTrade = (theState) => theState[TRADE_SLICE_NAME].trade;

export const getUserArticlesInfo = (theState) => theState[TRADE_SLICE_NAME].userArticlesInfo;

export const getPartnerArticlesInfo = (theState) => theState[TRADE_SLICE_NAME].partnerArticlesInfo;

export const getStepIndex = (theState) => theState[TRADE_SLICE_NAME].stepIndex;
