import { connect } from 'react-redux';

import TradeDetailPage from '../components/TradeDetailPage/TradeDetailPage';

import { acceptTrade, declineTrade, loadTrade, submitTrade } from '../store/actions/trade';
import { setLoading } from '../store/actions/application';
import { getTrade, getPartnerArticles, getUserArticles } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trade: getTrade(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, {
    loadTrade,
    setLoading,
    submitTrade,
    acceptTrade,
    declineTrade
})(TradeDetailPage);
