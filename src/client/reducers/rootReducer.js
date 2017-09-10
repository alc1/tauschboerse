import { combineReducers } from 'redux';

import userReducer from './userReducer';
import articleReducer from './articleReducer';

export default combineReducers({
    user: userReducer,
    article: articleReducer
});
