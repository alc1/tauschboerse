import { connect } from 'react-redux';

import Dashboard from '../components/Dashboard/Dashboard';

import { checkForNewTrades, loadUserArticles, loadUserTrades } from '../store/actions/user';
import { isLoading, getPollingInterval } from '../store/selectors/application';
import { getReloadTrades, getUserArticles, getUserTrades } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        loading: isLoading(theState),
        pollingInterval: getPollingInterval(theState),
        trades: getUserTrades(theState),
        canReloadTrades: getReloadTrades(theState)
    };
}

export default connect(mapStateToProps, {
    checkForNewTrades,
    loadUserArticles,
    loadUserTrades
})(Dashboard);
