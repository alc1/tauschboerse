import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import UserTradesPage from '../components/UserTradesPage/UserTradesPage';

import { loadUserTrades, openUserTradesSection } from '../store/actions/user';
import { setLoading } from '../store/actions/application';
import { getUser, getUserTrades, getUserTradesSectionIndex } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trades: getUserTrades(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        userTradesSectionIndex: getUserTradesSectionIndex(theState)
    };
}

export default connect(mapStateToProps, { loadUserTrades, openUserTradesSection, setLoading })(muiThemeable()(UserTradesPage));
