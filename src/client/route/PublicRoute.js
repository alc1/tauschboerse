import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getUser } from '../store/user';

const PublicRoute = ({ isLoggedIn, component: Component, ...rest }) => (
    <Route {...rest} render={props =>
        !isLoggedIn ? (
            <Component {...props}/>
        ) : (
            <Redirect to="/"/>
        )}
    />
);

PublicRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(theState) {
    return {
        isLoggedIn: !!getUser(theState)
    };
}

export default connect(mapStateToProps)(PublicRoute);