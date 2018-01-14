import { connect } from 'react-redux';

import EditTradePage from '../components/EditTradePage/EditTradePage';

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
        partnerArticlesInfo: getPartnerArticlesInfo(theState),
        idParamName: 'articleId',
        isCreating: true
    };
}

export default connect(mapStateToProps, {
    initTradeEditor,
    loadPartnerArticles,
    loadTrade: loadNewTrade,
    loadUserArticles,
    saveTrade,
    setFilterText,
    setLoading,
    setPageNum,
    setStepIndex,
    toggleArticle
})(EditTradePage);
