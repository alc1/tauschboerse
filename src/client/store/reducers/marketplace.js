import { ARTICLES_FOUND, LAST_SEARCH_CLEARED, MARKETPLACE_SECTION_OPENED } from '../actions/marketplace';
import SearchInfo from '../../model/SearchInfo';

export const initialState = {
    searchInfo: new SearchInfo(),
    marketplaceSectionIndex: -1
};

export default function marketplace(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLES_FOUND:
            return {
                ...theState,
                searchInfo: new SearchInfo(theState.searchInfo).setSearchResults(theAction.text, theAction.articles, theAction.userArticles)
            };

        case LAST_SEARCH_CLEARED:
            return {
                ...theState,
                searchInfo: new SearchInfo(theState.searchInfo).clear()
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
