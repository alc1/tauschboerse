export const getLastSearch = (theState) => {
    return (theState.marketplace) ? theState.marketplace.lastSearch : null;
};
