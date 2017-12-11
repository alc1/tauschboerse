const STATUS_FREE = 'FREE';
const STATUS_DEALING = 'DEALING';
const STATUS_DEALED = 'DEALED';
const STATUS_DELETED = 'DELETED';

function getDescription(theStatus) {
    switch (theStatus) {
        case STATUS_FREE:
            return 'Der Artikel steht zur Verfügung';
        case STATUS_DEALING:
            return 'Der Artikel wird gehandelt';
        case STATUS_DEALED:
            return 'Der Artikel wurde vergeben';
        case STATUS_DELETED:
            return 'Der Artikel wurde gelöscht';
        default:
            return theStatus;
    }
}

module.exports = {
    STATUS_FREE,
    STATUS_DEALING,
    STATUS_DEALED,
    STATUS_DELETED,
    getDescription
};
