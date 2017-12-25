import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WARNING_MESSAGE } from '../../store/actions/application';

const LoggedInRoute = ({ isLoggedIn, setGlobalMessage, component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        if (!isLoggedIn) {
            setGlobalMessage({
                messageText: 'Bitte melde dich an, um diese Seite aufzurufen.',
                messageType: WARNING_MESSAGE
            });
        }
        return isLoggedIn ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
        );}
    }/>
);

LoggedInRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    setGlobalMessage: PropTypes.func.isRequired
};

export default LoggedInRoute;
