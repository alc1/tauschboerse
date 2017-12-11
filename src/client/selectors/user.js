export const getUserArticles = (theState) => {
    return theState.user ? (theState.user.articles && theState.user.articles.sort((article1, article2) => article1.title.localeCompare(article2.title))) || [] : [];
};

export const getUserTrades = (theState) => {
    return theState.user ? theState.user.trades || [] : [];
};

export const getUser = (theState) => {
    return theState.user ? theState.user.user : undefined;
};

export const getUserId = (theState) => {
    const user = getUser(theState);
    return user ? user._id : undefined;
};
