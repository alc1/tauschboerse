const TRADE_STATUS_INIT = 'INIT';
const TRADE_STATUS_IN_NEGOTIATION = 'IN_NEGOTIATION';
const TRADE_STATUS_COMPLETED = 'COMPLETED';
const TRADE_STATUS_CANCELED = 'CANCELED';

function getDescription(theStatus) {
    switch (theStatus) {
        case TRADE_STATUS_INIT:
            return 'Das Tauschgeschäft wird verbereitet';
        case TRADE_STATUS_IN_NEGOTIATION:
            return 'Das Tauschgeschäft wird gehandelt';
        case TRADE_STATUS_COMPLETED:
            return 'Das Tauschgeschäft wurde erfolgreich abgeschlossen';
        case TRADE_STATUS_CANCELED:
            return 'Das Tauschgeschäft wurde abgebrochen';
        default:
            return theStatus;
    }
}

module.exports = {
    TRADE_STATUS_INIT,
    TRADE_STATUS_IN_NEGOTIATION,
    TRADE_STATUS_COMPLETED,
    TRADE_STATUS_CANCELED,
    getDescription
};
