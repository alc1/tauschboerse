import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import UserTradesPage from '../components/UserTradesPage/UserTradesPage';

import { checkForNewTrades, loadUserTrades, openUserTradesSection } from '../store/actions/user';
import { getReloadTrades, getUser, getUserTrades, getUserTradesSectionIndex } from '../store/selectors/user';
import { getPollingInterval, isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        canReloadTrades: getReloadTrades(theState),
        loading: isLoading(theState),
        pollingInterval: getPollingInterval(theState),
        trades: getUserTrades(theState),
        user: getUser(theState),
        userTradesSectionIndex: getUserTradesSectionIndex(theState)
    };
}

export default connect(mapStateToProps, { checkForNewTrades, loadUserTrades, openUserTradesSection })(muiThemeable()(UserTradesPage));
