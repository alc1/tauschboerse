import { TRADE_SLICE_NAME } from '../store/slices';

export const getTrades = (theState) => {
    return theState[TRADE_SLICE_NAME].trades;
};

export const getTrade = (theState) => {
    return theState[TRADE_SLICE_NAME].trade;
};
