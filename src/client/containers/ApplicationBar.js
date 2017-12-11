import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ApplicationBar from '../components/ApplicationBar';

import { getUser } from '../selectors/user';
import { logout } from '../actions/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(ApplicationBar));
