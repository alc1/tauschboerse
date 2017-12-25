import { connect } from 'react-redux';

import { setGlobalMessage } from '../store/actions/application';
import { getUser } from '../store/selectors/user';

import LoggedInRoute from '../components/LoggedInRoute/LoggedInRoute';

function mapStateToProps(theState) {
    return {
        isLoggedIn: !!getUser(theState)
    };
}

export default connect(mapStateToProps, { setGlobalMessage })(LoggedInRoute);
