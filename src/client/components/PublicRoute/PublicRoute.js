import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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

export default PublicRoute;