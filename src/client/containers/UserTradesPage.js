import { connect } from 'react-redux';

import UserTradesPage from '../components/UserTradesPage/UserTradesPage';

import { loadUserTrades } from '../store/actions/user';
import { setLoading } from '../store/actions/application';
import { getUser, getUserTrades } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        trades: getUserTrades(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadUserTrades, setLoading })(UserTradesPage);
