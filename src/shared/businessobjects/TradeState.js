const TRADE_STATE_INIT = 'INIT';
const TRADE_STATE_IN_NEGOTIATION = 'IN_NEGOTIATION';
const TRADE_STATE_COMPLETED = 'COMPLETED';
const TRADE_STATE_CANCELED = 'CANCELED';

function getDescription(theStatus) {
    switch (theStatus) {
        case TRADE_STATE_INIT:
            return 'Das Tauschgeschäft wird verbereitet';
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

module.exports = {
    TRADE_STATE_INIT,
    TRADE_STATE_IN_NEGOTIATION,
    TRADE_STATE_COMPLETED,
    TRADE_STATE_CANCELED,
    getDescription
};
