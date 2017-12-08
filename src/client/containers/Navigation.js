import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Navigation from '../components/Navigation';

import { getUser } from '../selectors/user';
import { logout } from '../actions/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(Navigation));
