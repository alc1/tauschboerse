import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DashboardActions from '../components/DashboardActions/DashboardActions';

import { logout } from '../store/actions/user';
import { getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(DashboardActions));
