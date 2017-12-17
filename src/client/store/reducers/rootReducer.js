import { combineReducers } from 'redux';

import applicationReducer from './application';
import articleReducer from './article';
import categoryReducer from './category';
import marketplaceReducer from './marketplace';
import tradeReducer from './trade';
import userReducer from './user';

import {
    APPLICATION_SLICE_NAME,
    ARTICLE_SLICE_NAME,
    CATEGORIES_SLICE_NAME,
    MARKETPLACE_SLICE_NAME,
    TRADE_SLICE_NAME,
    USER_SLICE_NAME
} from '../slices';

export default combineReducers({
    [APPLICATION_SLICE_NAME]: applicationReducer,
    [ARTICLE_SLICE_NAME]: articleReducer,
    [CATEGORIES_SLICE_NAME]: categoryReducer,
    [MARKETPLACE_SLICE_NAME]: marketplaceReducer,
    [TRADE_SLICE_NAME]: tradeReducer,
    [USER_SLICE_NAME]: userReducer
});
