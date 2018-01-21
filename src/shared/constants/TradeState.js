const TRADE_STATE_INIT = 'INIT';
const TRADE_STATE_IN_NEGOTIATION = 'IN_NEGOTIATION';
const TRADE_STATE_COMPLETED = 'COMPLETED';
const TRADE_STATE_CANCELED = 'CANCELED';

function getShortDescription(theStatus) {
    switch (theStatus) {
        case TRADE_STATE_INIT:
            return 'In Vorbereitung';
        case TRADE_STATE_IN_NEGOTIATION:
            return 'In Verhandlung';
        case TRADE_STATE_COMPLETED:
            return 'Erfolgreich';
        case TRADE_STATE_CANCELED:
            return 'Abgebrochen';
        default:
            return theStatus;
    }
}

function getDescription(theStatus) {
    switch (theStatus) {
        case TRADE_STATE_INIT:
            return 'Das Tauschgeschäft wird vorbereitet';
        case TRADE_STATE_IN_NEGOTIATION:
            return 'Das Tauschgeschäft wird gehandelt';
        case TRADE_STATE_COMPLETED:
            return 'Das Tauschgeschäft wurde erfolgreich abgeschlossen';
        case TRADE_STATE_CANCELED:
            return 'Das Tauschgeschäft wurde abgebrochen';
        default:
            return theStatus;
    }
}

function getColor(theStatus) {
    switch (theStatus) {
        case TRADE_STATE_INIT:
            return '#4444FF';
        case TRADE_STATE_IN_NEGOTIATION:
            return '#FFA000';
        case TRADE_STATE_COMPLETED:
            return '#00BCD4';
        case TRADE_STATE_CANCELED:
            return '#DD2C00';
        default:
            return '#000000';
    }
}

module.exports = {
    TRADE_STATE_INIT,
    TRADE_STATE_IN_NEGOTIATION,
    TRADE_STATE_COMPLETED,
    TRADE_STATE_CANCELED,
    getShortDescription,
    getDescription,
    getColor
};
