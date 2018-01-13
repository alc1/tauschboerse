import { connect } from 'react-redux';

import TradeDetailPage from '../components/TradeDetailPage/TradeDetailPage';

import { acceptTrade, checkForUpdatedTrade, declineTrade, loadTrade, setDelivered, submitTrade, withdrawTrade, deleteTrade } from '../store/actions/trade';
import { setLoading } from '../store/actions/application';
import { getNewVersionAvailable, getTrade } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState),
        newVersionAvailable: getNewVersionAvailable(theState),
        trade: getTrade(theState),
        user: getUser(theState),
    };
}

export default connect(mapStateToProps, {
    loadTrade,
    checkForUpdatedTrade,
    setDelivered,
    setLoading,
    submitTrade,
    acceptTrade,
    declineTrade,
    withdrawTrade,
    deleteTrade
})(TradeDetailPage);
