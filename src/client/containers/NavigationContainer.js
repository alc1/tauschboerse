import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavigationComponent from '../components/NavigationComponent';

import { getUser } from '../selectors/user';
import { logout } from '../actions/user';

class NavigationContainer extends React.Component {

    static propTypes = {
        closeMenu: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    render() {
        const { user, closeMenu, history, logout } = this.props;
        return (
            <NavigationComponent user={user} closeMenu={closeMenu} history={history} logout={logout}/>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(NavigationContainer));
