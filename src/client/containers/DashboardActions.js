import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DashboardActions from '../components/DashboardActions/DashboardActions';

import { gotoUserTradesPage, logout } from '../store/actions/user';
import { getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, {
    gotoUserTradesPage,
    logout
})(DashboardActions));
