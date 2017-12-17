import { APPLICATION_SLICE_NAME } from '../slices';

export const getGlobalMessage = (theState) => {
    return theState[APPLICATION_SLICE_NAME] ? theState[APPLICATION_SLICE_NAME].globalMessage : {};
};

export const isLoading = (theState) => {
    return theState[APPLICATION_SLICE_NAME] ? theState[APPLICATION_SLICE_NAME].isLoading : false;
};
