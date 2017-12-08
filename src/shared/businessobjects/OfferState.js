const OFFER_STATE_INIT = 'INIT';
const OFFER_STATE_REQUESTED = 'REQUESTED';
const OFFER_STATE_ACCEPTED = 'ACCEPTED';
const OFFER_STATE_DECLINED = 'DECLINED';
const OFFER_STATE_WITHDRAWN = 'WITHDRAWN';
const OFFER_STATE_INVALIDATED = 'INVALIDATED';

function getDescription(theState) {
    switch (theState) {
        case OFFER_STATE_INIT:
            return 'Der Vorschlag wird ausgeaerbeitet';
        case OFFER_STATE_REQUESTED:
            return 'Der aktuelle Vorschlag wurde angeboten';
        case OFFER_STATE_ACCEPTED:
            return 'Das Tauschgeschäft wurde akzeptiert';
        case OFFER_STATE_DECLINED:
            return 'Das Tauschgeschäft wurde abgelehnt';
        case OFFER_STATE_WITHDRAWN:
            return 'Der aktuelle Vorschlag wurde zurückgezogen';
        case OFFER_STATE_INVALIDATED:
            return 'Der Vorschlag wurde annulliert';
        default:
            return theStatus;
    }
}

module.exports = {
    OFFER_STATE_INIT,
    OFFER_STATE_REQUESTED,
    OFFER_STATE_ACCEPTED,
    OFFER_STATE_DECLINED,
    OFFER_STATE_WITHDRAWN,
    OFFER_STATE_INVALIDATED,
    getDescription
};
