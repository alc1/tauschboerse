const STATUS_FREE = 'FREE';
const STATUS_DEALING = 'DEALING';
const STATUS_DEALED = 'DEALED';
const STATUS_DELETED = 'DELETED';

function getShortDescription(theStatus) {
    switch (theStatus) {
        case STATUS_FREE:
            return 'Frei';
        case STATUS_DEALING:
            return 'In Verhandlung';
        case STATUS_DEALED:
            return 'Getauscht';
        case STATUS_DELETED:
            return 'Gelöscht';
        default:
            return theStatus;
    }
}

function getDescription(theStatus) {
    switch (theStatus) {
        case STATUS_FREE:
            return 'Artikel steht frei zur Verfügung';
        case STATUS_DEALING:
            return 'Der Artikel wird gehandelt';
        case STATUS_DEALED:
            return 'Der Artikel wurde getauscht';
        case STATUS_DELETED:
            return 'Der Artikel wurde gelöscht';
        default:
            return theStatus;
    }
}

function getColor(theStatus) {
    switch (theStatus) {
        case STATUS_FREE:
            return '#9E9E9E';
        case STATUS_DEALING:
            return '#FFA000';
        case STATUS_DEALED:
            return '#00BCD4';
        case STATUS_DELETED:
            return '#DD2C00';
        default:
            return '#000000';
    }
}

module.exports = {
    STATUS_FREE,
    STATUS_DEALING,
    STATUS_DEALED,
    STATUS_DELETED,
    getShortDescription,
    getDescription,
    getColor
};
