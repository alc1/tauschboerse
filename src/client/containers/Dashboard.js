import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Dashboard from '../components/Dashboard';

import { setLoading } from '../actions/application';
import { logout, loadUserArticles, loadUserTrades } from '../actions/user';
import { getUserArticles, getUserTrades } from '../selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        trades: getUserTrades(theState)
    };
}

export default withRouter(connect(mapStateToProps, { setLoading, logout, loadUserArticles, loadUserTrades })(Dashboard));
