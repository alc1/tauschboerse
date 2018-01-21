import {
    USER_ARTICLES_FETCHED,
    USER_ARTICLES_FILTERED,
    USER_CREATED,
    USER_GOTO_TRADES_PAGE_RECEIVED,
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_TRADES_FETCHED,
    USER_TRADES_SECTION_OPENED,
    USER_TRADES_VERSION_FETCHED,
    USER_UPDATED
} from '../actions/user';

import {
    ARTICLE_DELETED,
    ARTICLE_FETCHED,
    ARTICLE_UPDATED,
} from '../actions/article';

import UserArticlesInfo from '../../model/UserArticlesInfo';
import TradesModel from '../../model/TradesModel';
import { GLOBAL_PAGE_SIZE_CHANGED } from '../actions/application';

import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export const initialState = {
    user: null,
    trades: new TradesModel(),
    reloadTrades: false,
    userTradesSectionIndex: -1,
    userArticlesInfo: new UserArticlesInfo(),
    settings: {
        pageSize: DEFAULT_PAGE_SIZE
    }
};

// current highest trade versionstamp
let highestVersionstamp = 0;

export default function user(theState = initialState, theAction) {
    let newState;

    switch (theAction.type) {
        case USER_LOGGED_IN:
        case USER_CREATED:
        case USER_UPDATED:
            return {
                ...theState,
                user: theAction.user
            };
        case USER_LOGGED_OUT:
            return initialState;
        case USER_ARTICLES_FETCHED:
            return {
                ...theState,
                userArticlesInfo: new UserArticlesInfo(theState.userArticlesInfo).setArticles(theAction.articles)
            };
        case USER_TRADES_FETCHED:
            highestVersionstamp = theAction.trades.highestVersionstamp;

            return {
                ...theState,
                trades: theAction.trades,
                reloadTrades: false,
                userTradesSectionIndex: getCurrentUserTradesSectionIndex(theAction.trades, theState.userTradesSectionIndex)
            };
        case USER_TRADES_VERSION_FETCHED:
            newState = theState;
            if (theAction.versionstamp > highestVersionstamp) {
                highestVersionstamp = theAction.versionstamp;
                newState = {
                    ...theState,
                    reloadTrades: true
                };
            }
            return newState;
        case ARTICLE_FETCHED:
        case ARTICLE_UPDATED:
            return {
                ...theState,
                userArticlesInfo: new UserArticlesInfo(theState.userArticlesInfo).updateArticle(theAction.article)
            };
        case ARTICLE_DELETED:
            return {
                ...theState,
                userArticlesInfo: new UserArticlesInfo(theState.userArticlesInfo).deleteArticle(theAction.articleId)
            };
        case USER_ARTICLES_FILTERED:
            return {
                ...theState,
                userArticlesInfo: new UserArticlesInfo(theState.userArticlesInfo).setFilter(theAction.filterText, theAction.filterStatus)
            };
        case USER_TRADES_SECTION_OPENED:
            return {
                ...theState,
                userTradesSectionIndex: theAction.userTradesSectionIndex
            };
        case GLOBAL_PAGE_SIZE_CHANGED:
            if (theState.settings.pageSize !== theAction.pageSize) {
                newState = {
                    ...theState,
                    settings: {
                        ...theState.settings,
                        pageSize: theAction.pageSize
                    }
                }
            }

            return (newState) ? newState : theState;
        case USER_GOTO_TRADES_PAGE_RECEIVED:
            if (theState.userTradesSectionIndex === -1) {
                return theState;
            } else {
                return {
                    ...theState,
                    userTradesSectionIndex: -1
                };
            }
        default:
            return theState;
    }
}

function getCurrentUserTradesSectionIndex(theTradesModel, currentSectionIndex) {
    if (currentSectionIndex >= 0) {
        // check if current section index is valid - if it is don't change it
        let indexValid;
        switch(currentSectionIndex) {
            case 0:
                indexValid = theTradesModel.hasNewTrades;
                break;
            case 1:
                indexValid = theTradesModel.hasTradesRequiringAttention;
                break;
            case 2:
                indexValid = theTradesModel.hasOpenTradesNotRequiringAttention;
                break;
            case 3:
                indexValid = theTradesModel.hasCompletedTrades;
                break;
            case 4:
                indexValid = theTradesModel.hasCanceledTrades;
                break;
            default:
                indexValid = false;
        }
        if (indexValid) {
            return currentSectionIndex;
        }
    }

    if (theTradesModel.hasTradesRequiringAttention) {
        return 1;
    }
    else if (theTradesModel.hasNewTrades) {
        return 0;
    }
    else if (theTradesModel.hasOpenTradesNotRequiringAttention) {
        return 2;
    }
    else if (theTradesModel.hasCompletedTrades) {
        return 3;
    }
    else if (theTradesModel.hasCanceledTrades) {
        return 4;
    }
    else {
        return -1;
    }
};