import './client/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';

import { setToken, userLoggedIn } from './client/store/actions/user';
import { JWT_TOKEN_KEY } from './client/utils/constants';
import store from './client/store/store';
import { setupApiInterceptors } from './client/utils/serverApi';

import App from './client/App';
import registerServiceWorker from './client/registerServiceWorker';

setupApiInterceptors();

const jwtToken = sessionStorage.getItem(JWT_TOKEN_KEY);
if (jwtToken) {
    setToken(jwtToken, store.dispatch, userLoggedIn);
}

ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();
