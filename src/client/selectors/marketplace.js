export const getLastSearch = (theState) => {
    return (theState.marketplace) ? theState.marketplace.lastSearch : null;
};

export const getTrade = (theState) => {
    return (theState.marketplace) ? theState.marketplace.trade : null;
};
