import React from 'react';
import ReactDOM from 'react-dom';

import { setToken, userLoggedIn } from './client/store/actions/user';
import { JWT_TOKEN_KEY } from './client/constants/jwt';
import store from './client/store/store';
import { setupApiInterceptors } from './client/util/serverApi';

import App from './client/App';
import registerServiceWorker from './client/registerServiceWorker';

function readJwtToken() {
    let jwtToken = sessionStorage.getItem(JWT_TOKEN_KEY);
    if (!jwtToken) {
        jwtToken = localStorage.getItem(JWT_TOKEN_KEY);
    }
    return jwtToken;
}

setupApiInterceptors();

const jwtToken = readJwtToken();
if (jwtToken) {
    setToken(jwtToken, store.dispatch, userLoggedIn);
}

ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();