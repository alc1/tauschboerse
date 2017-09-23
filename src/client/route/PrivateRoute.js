import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getUser } from '../store/user';

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
    <Route {...rest} render={props =>
        isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
        )}
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(theState) {
    return {
        isAuthenticated: !!getUser(theState)
    };
}

export default connect(mapStateToProps)(PrivateRoute);
