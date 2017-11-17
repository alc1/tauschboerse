import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { setToken, userLoggedIn } from './client/actions/user';
import { JWT_TOKEN_KEY } from './client/common';
import store from './client/store/store';
import history from './client/history/history';

import App from './client/App';

import './client/styles.css';

const jwtToken = localStorage.getItem(JWT_TOKEN_KEY);
if (jwtToken) {
    setToken(jwtToken, store.dispatch, userLoggedIn);
}

const provider = (
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={history}>
                <App/>
            </Router>
        </Provider>
    </MuiThemeProvider>
);

ReactDOM.render(provider, document.getElementById('root'));
