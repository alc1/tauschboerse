import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';

import Dashboard from '../components/Dashboard';

import { setLoading } from '../store/actions/application';
import { logout, loadUserArticles, loadUserTrades } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';
import { getUserArticles, getUserTrades } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        trades: getUserTrades(theState),
        loading: isLoading(theState)
    };
}

export default withRouter(connect(mapStateToProps, { setLoading, logout, loadUserArticles, loadUserTrades })(muiThemeable()(Dashboard)));
