import React from 'react';
import ReactDOM from 'react-dom';

import { setToken, userLoggedIn } from './client/actions/user';
import { JWT_TOKEN_KEY } from './client/common';
import store from './client/store/store';

import App from './client/App';

const jwtToken = localStorage.getItem(JWT_TOKEN_KEY);
if (jwtToken) {
    setToken(jwtToken, store.dispatch, userLoggedIn);
}

ReactDOM.render(<App/>, document.getElementById('root'));
