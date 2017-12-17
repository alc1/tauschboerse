import { connect } from 'react-redux';

import { getUser } from '../store/selectors/user';

import PublicRoute from '../components/PublicRoute/PublicRoute';

function mapStateToProps(theState) {
    return {
        isLoggedIn: !!getUser(theState)
    };
}

export default connect(mapStateToProps)(PublicRoute);