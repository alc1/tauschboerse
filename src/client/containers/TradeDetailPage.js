import { connect } from 'react-redux';

import TradeDetailPage from '../components/TradeDetailPage/TradeDetailPage';

import { acceptTrade, checkForUpdatedTrade, declineTrade, loadTrade, setDelivered, submitTrade, withdrawTrade, deleteTrade } from '../store/actions/trade';
import { setGlobalMessage } from '../store/actions/application';
import { gotoUserTradesPage } from '../store/actions/user';
import { getNewVersionAvailable, getReloadTrade, getTrade, getTradeDeleted, getTradeNotFound } from '../store/selectors/trade';
import { getUser } from '../store/selectors/user';
import { isLoading, getPollingInterval } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        deleted: getTradeDeleted(theState),
        loading: isLoading(theState),
        newVersionAvailable: getNewVersionAvailable(theState),
        reloadTrade: getReloadTrade(theState),
        notFound: getTradeNotFound(theState),
        pollingInterval: getPollingInterval(theState),
        trade: getTrade(theState),
        user: getUser(theState)
    };
}

export default connect(mapStateToProps, {
    acceptTrade,
    checkForUpdatedTrade,
    declineTrade,
    deleteTrade,
    gotoUserTradesPage,
    loadTrade,
    setDelivered,
    setGlobalMessage,
    submitTrade,
    withdrawTrade
})(TradeDetailPage);
