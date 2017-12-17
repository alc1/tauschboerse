import { connect } from 'react-redux';

import { setGlobalMessage } from '../store/actions/application';
import { getUser, getUserId } from '../store/selectors/user';

import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

function mapStateToProps(theState) {
    return {
        isLoggedIn: !!getUser(theState),
        userId: getUserId(theState)
    };
}

export default connect(mapStateToProps, { setGlobalMessage })(PrivateRoute);
