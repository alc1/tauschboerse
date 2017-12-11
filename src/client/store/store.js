import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/rootReducer';

import { initialState as applicationInitialState } from '../reducers/application';
import { initialState as articleInitialState } from '../reducers/article';
import { initialState as categoryInitialState } from '../reducers/category';
import { initialState as marketplaceInitialState } from '../reducers/marketplace';
import { initialState as tradeInitialState } from '../reducers/trade';
import { initialState as userInitialState } from '../reducers/user';

const initialState = {
    application: applicationInitialState,
    article: articleInitialState,
    categories: categoryInitialState,
    marketplace: marketplaceInitialState,
    trade: tradeInitialState,
    user: userInitialState
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
