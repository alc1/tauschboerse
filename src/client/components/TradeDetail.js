import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './TradeDetail.css';

class TradeDetail extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
    };

    static defaultProps = {
        trade: null
    };

    // constructor(props) {
    //     super(props);
    // }

    generateContentForNewTrade() {
        return null;
    }
    
    generateContentForMadeOffer() {
        return null;
    }

    generateContentForReceivedOffer() {
        return null;
    }

    generateContentForUnforeseenState() {
        return (
            <div>Das Tauschgeschäft ist in einem unvorhergesehenen Zustand geraten - die Entwickler müssen wieder 'ran!</div>
        );
    }

    render() {
        let title = this.props.trade ? <h1>Tauschgeschäft mit {this.props.trade.tradePartner.name}</h1> : <h1>Unbekanntes Tauschgescäft</h1>;
        let content = null;
        if (this.props.trade.isNew) {
            content = this.generateContentForNewTrade();
        } else if (this.props.trade.hasMadeCurrentOffer) {
            content = this.generateContentForMadeOffer();
        } else if (this.props.trade.requiresInputFromUser) {
            content = this.generateContentForReceivedOffer();
        } else {
            content = this.generateContentForUnforeseenState();
        }

        return (
            <div>
                {title}
                {content}
            </div>
        );
    }
}

export default TradeDetail;