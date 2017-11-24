import { combineReducers } from 'redux';

import applicationReducer from './application';
import userReducer from './user';
import articleReducer from './article';
import categoryReducer from './category';

export default combineReducers({
    application: applicationReducer,
    user: userReducer,
    article: articleReducer,
    categories: categoryReducer
});
