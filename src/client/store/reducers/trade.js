import {
    TRADE_ARTICLE_FILTER_TEXT_SET,
    TRADE_ARTICLE_TOGGLED,
    TRADE_ARTICLES_FETCHED,
    TRADE_ARTICLES_SAVED,
    TRADE_DELETED,
    TRADE_EDITOR_INITIALISED,
    TRADE_FETCHED,
    TRADE_FETCHING,
    TRADE_NEW_VERSION_AVAILABLE,
    TRADE_NOT_FOUND,
    TRADE_PAGE_NUM_SET,
    TRADE_STEP_INDEX_SET
} from '../actions/trade';
import { PAGE_SIZE_CHANGED } from '../actions/application';
import ArticlesDisplayInfo from '../../model/ArticlesDisplayInfo';

export const initialState = {
    trade: null,
    notFound: false,
    newVersionAvailable: false,
    stepIndex: 0,
    userArticlesInfo: new ArticlesDisplayInfo(),
    partnerArticlesInfo: new ArticlesDisplayInfo()
};

export default function trade(theState = initialState, theAction) {
    let newState;

    switch (theAction.type) {
        case PAGE_SIZE_CHANGED:
            return {
                ...theState,
                userArticlesInfo: new ArticlesDisplayInfo(theState.userArticlesInfo).setPageSize(theAction.pageSize),
                partnerArticlesInfo: new ArticlesDisplayInfo(theState.partnerArticlesInfo).setPageSize(theAction.pageSize)
            };

        case TRADE_EDITOR_INITIALISED:
            return {
                ...theState,
                stepIndex: 0,
                userArticlesInfo: new ArticlesDisplayInfo(theState.userArticlesInfo).setFiltertext(''),
                partnerArticlesInfo: new ArticlesDisplayInfo(theState.partnerArticlesInfo).setFiltertext('')
            };

        case TRADE_ARTICLE_FILTER_TEXT_SET:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticlesInfo = new ArticlesDisplayInfo(theState.userArticlesInfo).setFiltertext(theAction.text);
            } else {
                newState.partnerArticlesInfo = new ArticlesDisplayInfo(theState.partnerArticlesInfo).setFiltertext(theAction.text);
            }

            return newState;

        case TRADE_STEP_INDEX_SET:
            return {
                ...theState,
                stepIndex: theAction.stepIndex
            };

        case TRADE_PAGE_NUM_SET:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticlesInfo = new ArticlesDisplayInfo(theState.userArticlesInfo).setPageNum(theAction.pageNum);
            } else {
                newState.partnerArticlesInfo = new ArticlesDisplayInfo(theState.partnerArticlesInfo).setPageNum(theAction.pageNum);
            }

            return newState;

        case TRADE_ARTICLE_TOGGLED:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticlesInfo = new ArticlesDisplayInfo(theState.userArticlesInfo).toggleArticle(theAction.article);
            } else {
                newState.partnerArticlesInfo = new ArticlesDisplayInfo(theState.partnerArticlesInfo).toggleArticle(theAction.article);
            }

            return newState;

        case TRADE_FETCHING:
            return {
                ...theState,
                trade: null,
                notFound: false,
                newVersionAvailable: false
            };

        case TRADE_FETCHED:
            let offer = theAction.trade.isMakingCounteroffer ? theAction.trade.counteroffer : theAction.trade.currentOffer;

            return {
                ...theState,
                trade: theAction.trade,
                userArticlesInfo: new ArticlesDisplayInfo(theState.userArticlesInfo).setChosenArticles(offer.userArticles.slice()),
                partnerArticlesInfo: new ArticlesDisplayInfo(theState.partnerArticlesInfo).setChosenArticles(offer.tradePartnerArticles.slice())
            };

        case TRADE_NOT_FOUND:
            return {
                ...theState,
                notFound: true
            };

        case TRADE_DELETED:
            return {
                ...theState,
                trade: null,
                notFound: true,
                userArticlesInfo: new ArticlesDisplayInfo(),
                partnerArticlesInfo: new ArticlesDisplayInfo()
            };

        case TRADE_ARTICLES_SAVED:
            return {
                ...theState
            }

        case TRADE_ARTICLES_FETCHED:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticlesInfo = new ArticlesDisplayInfo(theState.userArticlesInfo).setArticles(theAction.articles);
            } else {
                newState.partnerArticlesInfo = new ArticlesDisplayInfo(theState.partnerArticlesInfo).setArticles(theAction.articles);
            }

            return newState;

        case TRADE_NEW_VERSION_AVAILABLE:
            return {
                ...theState,
                newVersionAvailable: true
            };

        default:
            return theState;
    }
}
