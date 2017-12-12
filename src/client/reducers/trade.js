import {
    TRADE_FETCHED,
    TRADE_SAVED,
    TRADE_STATE_CHANGED
} from './../actions/trade';

export const initialState = {};

export default function trade(theState = initialState, theAction) {
    switch (theAction.type) {
        case TRADE_FETCHED:
        case TRADE_SAVED:
        case TRADE_STATE_CHANGED:
            return {
                ...theState,
                trade: theAction.trade
            };
        default:
            return theState;
    }
}
