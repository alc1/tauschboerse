import { connect } from 'react-redux';

import NewTradePage from '../components/NewTradePage/NewTradePage';

import { initTradeEditor, loadNewTrade, loadPartnerArticles, loadUserArticles, saveTrade, setFilterText, setPageNum, setStepIndex, toggleArticle } from '../store/actions/trade';
import { setLoading } from '../store/actions/application';
import { getPartnerArticlesInfo, getStepIndex, getTrade, getUserArticlesInfo } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trade: getTrade(theState),
        user: getUser(theState),
        stepIndex: getStepIndex(theState),
        loading: isLoading(theState),
        userArticlesInfo: getUserArticlesInfo(theState),
        partnerArticlesInfo: getPartnerArticlesInfo(theState)
    };
}

export default connect(mapStateToProps, {
    initTradeEditor,
    loadNewTrade,
    loadPartnerArticles,
    loadUserArticles,
    saveTrade,
    setFilterText,
    setLoading,
    setPageNum,
    setStepIndex,
    toggleArticle
})(NewTradePage);
