import { connect } from 'react-redux';

import TradeDetailPage from '../components/TradeDetailPage/TradeDetailPage';

import { acceptTrade, declineTrade, loadTrade, submitTrade, loadUserArticles, loadPartnerArticles } from '../store/actions/trade';
import { setLoading } from '../store/actions/application';
import { getTrade, getPartnerArticles, getUserArticles } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trade: getTrade(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        userArticles: getUserArticles(theState),
        partnerArticles: getPartnerArticles(theState)
    };
}

export default connect(mapStateToProps, { loadTrade, setLoading, submitTrade, acceptTrade, declineTrade, loadUserArticles, loadPartnerArticles })(TradeDetailPage);
