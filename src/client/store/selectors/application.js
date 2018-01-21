import { APPLICATION_SLICE_NAME } from '../slices';
import GlobalMessageParams from '../../model/GlobalMessageParams';

// getGlobalMessage always returns an instance of GlobalMessageParams. Store retains null when no global message is present
// so that the appropriate reducers can determine if the message needs to be removed
const emptyGlobalMessage = new GlobalMessageParams();

export const getGlobalMessage = (theState) => theState[APPLICATION_SLICE_NAME].globalMessage || emptyGlobalMessage;

export const isLoading = (theState) => theState[APPLICATION_SLICE_NAME].isLoading;

export const getPollingInterval = (theState) => theState[APPLICATION_SLICE_NAME].pollingInterval;