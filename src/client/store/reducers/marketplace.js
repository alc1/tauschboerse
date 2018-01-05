import {
    ARTICLES_FOUND,
    LAST_SEARCH_CLEARED,
    TRADE_CREATED,
    MARKETPLACE_SECTION_OPENED
} from '../actions/marketplace';

export const initialState = {
    marketplaceSectionIndex: -1
};

export default function marketplace(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLES_FOUND:
            return {
                ...theState,
                lastSearch: { text: theAction.text, articles: theAction.articles, version: theAction.version }
            };
        case LAST_SEARCH_CLEARED:
            return {
                ...theState,
                lastSearch: undefined
            };
        case TRADE_CREATED:
            return {
                ...theState,
                trade: theAction.trade
            };
        case MARKETPLACE_SECTION_OPENED:
            return {
                ...theState,
                marketplaceSectionIndex: theAction.marketplaceSectionIndex
            };
        default:
            return theState;
    }
}
