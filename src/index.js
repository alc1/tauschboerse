import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import rootReducer from './client/reducers/rootReducer';

import App from './client/App';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

const provider = (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(provider, document.getElementById('root'));
