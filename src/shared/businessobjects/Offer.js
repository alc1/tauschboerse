const utils = require('../utils/businessUtils');

class Offer {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'trade', obj, null);
            utils.setValue(this, 'sender', obj, null);
            utils.setValue(this, 'receiver', obj, null);
            utils.setValue(this, 'articles', obj, []);

            utils.transferId(obj, this);
        } else {
            this.trade = null;
            this.sender = null;
            this.receiver = null;
            this.articles = [];
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'trade', obj) || modified;
        modified = utils.updateValue(this, 'sender', obj) || modified;
        modified = utils.updateValue(this, 'receiver', obj) || modified;
        modified = utils.updateValue(this, 'articles', obj) || modified;
        
        return modified;
    }

    canSave() {
        return (this.trade != null)
            && (this.sender != null)
            && (this.receiver != null)
            && (((this.trade.user1 === this.sender) && (this.trade.user2 === this.receiver)) || ((this.trade.user2 === this.sender) && (this.trade.user1 === this.receiver)))
            && this.articles.every(article => ((article.owner === this.sender) || (article.owner === this.receiver)));
    }
}

module.exports = Offer;