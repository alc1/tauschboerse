import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getUser, getUserId } from '../selectors/user';

const PrivateRoute = ({ isLoggedIn, userId, component: Component, ...rest }) => (
    <Route {...rest} render={props =>
        props.match.params.userId === userId ? (
            <Component {...props}/>
        ) : (
            isLoggedIn ? (
                <Redirect to="/"/>
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
            )
        )}
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(theState) {
    return {
        isLoggedIn: !!getUser(theState),
        userId: getUserId(theState)
    };
}

export default connect(mapStateToProps)(PrivateRoute);
