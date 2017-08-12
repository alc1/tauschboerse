import { combineReducers } from 'redux';

import userArticlesReducer from './userArticlesReducer';
import articleDetailReducer from './articleDetailReducer';

export default combineReducers({
    userArticles: userArticlesReducer,
    article: articleDetailReducer
});
