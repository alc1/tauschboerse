import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import 'semantic-ui-css/semantic.min.css';
import './client/styles.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { userLoggedIn } from './client/actions/user';
import { JWT_TOKEN_KEY } from './client/common';
import store from './client/store/store';
import history from './client/history/history';
import App from './client/App';

const jwtToken = localStorage.getItem(JWT_TOKEN_KEY);
if (jwtToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    const user = jwt.decode(jwtToken);
    store.dispatch(userLoggedIn(user));
}

const provider = (
    <MuiThemeProvider>
        <Provider store={store}>
            <BrowserRouter history={history}>
                <App/>
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>
);

ReactDOM.render(provider, document.getElementById('root'));
