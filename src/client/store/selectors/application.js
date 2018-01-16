import { APPLICATION_SLICE_NAME } from '../slices';

export const getGlobalMessage = (theState) => theState[APPLICATION_SLICE_NAME].globalMessage;

export const isLoading = (theState) => theState[APPLICATION_SLICE_NAME].loadingCounter > 0;

export const getPollingInterval = (theState) => theState[APPLICATION_SLICE_NAME].pollingInterval;