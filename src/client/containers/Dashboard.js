import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import Dashboard from '../components/Dashboard/Dashboard';

import { setLoading } from '../store/actions/application';
import { loadUserArticles, loadUserTrades } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';
import { getUserArticles, getUserTrades } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        trades: getUserTrades(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { setLoading, loadUserArticles, loadUserTrades })(muiThemeable()(Dashboard));
