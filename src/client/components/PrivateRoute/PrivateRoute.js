import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WARNING_MESSAGE } from '../../model/GlobalMessageParams';

const PrivateRoute = ({ isLoggedIn, userId, setGlobalMessage, component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const hasPermission = props.match.params.userId === userId;
        if (!hasPermission) {
            setGlobalMessage(`Keine Berechtigung für die Seite: ${props.location.pathname + props.location.search}`, WARNING_MESSAGE);
        }
        return hasPermission ? (
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
        );}
    }/>
);

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    setGlobalMessage: PropTypes.func.isRequired
};

export default PrivateRoute;
