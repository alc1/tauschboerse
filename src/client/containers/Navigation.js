import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Navigation from '../components/Navigation/Navigation';

import { getUser } from '../store/selectors/user';
import { logout } from '../store/actions/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(Navigation));
