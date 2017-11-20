import { combineReducers } from 'redux';

import userReducer from './user';
import articleReducer from './article';
import categoryReducer from './category';
import globalMessageReducer from './globalMessage';

export default combineReducers({
    user: userReducer,
    article: articleReducer,
    categories: categoryReducer,
    globalMessage: globalMessageReducer
});
