import { USER_SLICE_NAME } from '../store/slices';

export const getUserArticles = (theState) => {
    return theState[USER_SLICE_NAME] ? (theState[USER_SLICE_NAME].articles && theState[USER_SLICE_NAME].articles.sort((article1, article2) => article1.title.localeCompare(article2.title))) || [] : [];
};

export const getUserTrades = (theState) => {
    return theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].trades || [] : [];
};

export const getUser = (theState) => {
    return theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].user : undefined;
};

export const getUserId = (theState) => {
    const user = getUser(theState);
    return user ? user._id : undefined;
};
