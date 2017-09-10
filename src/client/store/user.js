export const getUserArticles = (theState) => {
    return theState.user ? theState.user.articles || [] : [];
};

export const getUser = (theState) => {
    return theState.user ? theState.user.user : undefined;
};
