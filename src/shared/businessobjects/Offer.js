const utils = require('../utils/businessUtils');

class Offer {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'transaction', obj, null);
            utils.setValue(this, 'sender', obj, null);
            utils.setValue(this, 'receiver', obj, null);
            utils.setValue(this, 'articles', obj, []);
        } else {
            this.transaction = null;
            this.sender = null;
            this.receiver = null;
            this.articles = [];
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'transaction', obj) || modified;
        modified = utils.updateValue(this, 'sender', obj) || modified;
        modified = utils.updateValue(this, 'receiver', obj) || modified;
        modified = utils.updateValue(this, 'articles', obj) || modified;
        
        return modified;
    }

    canSave() {
        return (this.transaction != null)
            && (this.sender != null)
            && (this.receiver != null)
            && (((this.transaction.user1 === this.sender) && (this.transaction.user2 === this.receiver)) || ((this.transaction.user2 === this.sender) && (this.transaction.user1 === this.receiver)))
            && this.articles.every(article => ((article.owner === this.sender) || (article.owner === this.receiver)));
    }
}

module.exports = Offer;