import { connect } from 'react-redux';

import NewTradePage from '../components/NewTradePage/NewTradePage';

import { loadNewTrade, loadUserArticles, loadPartnerArticles, startEditingUserArticles, startEditingPartnerArticles, cancelEditingUserArticles, cancelEditingPartnerArticles, saveTrade, toggleUserArticle, togglePartnerArticle, setStepIndex } from '../store/actions/trade';
import { setLoading } from '../store/actions/application';
import { getTrade, getArticle, getPartnerArticles, getUserArticles, getChosenPartnerArticles, getChosenUserArticles, getStepIndex } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trade: getTrade(theState),
        user: getUser(theState),
        stepIndex: getStepIndex(theState),
        loading: isLoading(theState),
        userArticles: getUserArticles(theState),
        partnerArticles: getPartnerArticles(theState),
        chosenUserArticles: getChosenUserArticles(theState),
        chosenPartnerArticles: getChosenPartnerArticles(theState)
    };
}

export default connect(mapStateToProps, {
    loadNewTrade,
    saveTrade,
    setLoading,
    loadUserArticles,
    loadPartnerArticles,
    toggleUserArticle,
    togglePartnerArticle,
    setStepIndex
})(NewTradePage);
