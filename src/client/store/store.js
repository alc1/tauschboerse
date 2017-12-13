import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/rootReducer';

import { initialState as applicationInitialState } from '../reducers/application';
import { initialState as articleInitialState } from '../reducers/article';
import { initialState as categoryInitialState } from '../reducers/category';
import { initialState as marketplaceInitialState } from '../reducers/marketplace';
import { initialState as tradeInitialState } from '../reducers/trade';
import { initialState as userInitialState } from '../reducers/user';

import {
    APPLICATION_SLICE_NAME,
    ARTICLE_SLICE_NAME,
    CATEGORIES_SLICE_NAME,
    MARKETPLACE_SLICE_NAME,
    TRADE_SLICE_NAME,
    USER_SLICE_NAME
} from './slices';

const initialState = {
    [APPLICATION_SLICE_NAME]: applicationInitialState,
    [ARTICLE_SLICE_NAME]: articleInitialState,
    [CATEGORIES_SLICE_NAME]: categoryInitialState,
    [MARKETPLACE_SLICE_NAME]: marketplaceInitialState,
    [TRADE_SLICE_NAME]: tradeInitialState,
    [USER_SLICE_NAME]: userInitialState
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
