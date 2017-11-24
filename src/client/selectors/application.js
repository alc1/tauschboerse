export const getGlobalMessage = (theState) => {
    return theState.application ? theState.application.globalMessage : {};
};

export const isLoading = (theState) => {
    return theState.application ? theState.application.isLoading : false;
};
