import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';

import TradeAction from '../../constants/TradeAction';
import Articles from '../Articles/Articles';

import './TradeDetail.css';

class TradeDetail extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadTrade: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        submitTrade: PropTypes.func.isRequired,
        acceptTrade: PropTypes.func.isRequired,
        declineTrade: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        trade: null
    };

    // state = {
    // };

    angebotMachen = () => { };

    handleEdit = () => {
        this.props.history.push(`/trade/edit/${this.props.trade._id}`);
    }

    generateContentForNewTrade() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <Articles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} />
                <Articles articles={this.props.trade.userArticles} title="Du bietest dafür folgende Artikel an:" />
                <section>
                    <div><button type="button" onClick={this.angebotMachen}>Angebot machen</button></div>
                </section>
            </div>
        );
    }
    
    generateContentForMadeOffer() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <Articles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} />
                <Articles articles={this.props.trade.userArticles} title="Du hast dafür folgende Artikel angeboten:" />
                <section>
                    <div>{this.props.trade.tradePartner.name} hat sich noch nicht entschieden</div>
                    <div><button type="button" onClick={this.doAction.bind(this, TradeAction.TRADE_ACTION_WITHDRAW)}>Angebot zurückziehen</button></div>
                </section>
            </div>
        );
    }

    generateContentForReceivedOffer() {
        let tradePartnerArticlesTitle = `${this.props.trade.tradePartner.name} möchte folgende Artikel von Dir:`;
        
        return (
            <div>
                <Articles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} />
                <Articles articles={this.props.trade.userArticles} title="Dafür bietet er/sie Dir folgende Artikel an:" />
                <section>
                    <div>
                        <button type="button" onClick={this.doAction.bind(this, TradeAction.TRADE_ACTION_ACCEPT)}>Angebot annehmen</button>
                        <button type="button" onClick={this.doAction.bind(this, TradeAction.TRADE_ACTION_DECLINE)}>Angebot ablehnen</button>
                        <button type="button" onClick={this.doAction.bind(this, TradeAction.TRADE_ACTION_MAKE_COUNTEROFFER)}>Gegenangebot machen</button>
                    </div>
                </section>
            </div>
        );
    }

    generateContentForCounterOffer() {

    }

    generateContentForDeclinedOffer() {

    }

    generateContentForCompletedTrade() {

    }

    generateContentForCanceledTrade() {
    }

    generateContentForUnforeseenState() {
        return (
            <div>Das Tauschgeschäft ist in einem unvorhergesehenen Zustand geraten - die Entwickler müssen wieder 'ran!</div>
        );
    }

    renderEditButton = () => (
        <div>
            <RaisedButton label="Bearbeiten" disabled={!this.props.trade.canEdit} primary={true} onClick={this.handleEdit} />
        </div>
    );

    render() {
        let title = this.props.trade ? <h1>Tauschgeschäft mit {this.props.trade.tradePartner.name}</h1> : <h1>Unbekanntes Tauschgeschäft</h1>;

        let content = null;
        if (this.props.trade.isNew) {
            content = this.generateContentForNewTrade();
        } else if (this.props.trade.hasMadeCurrentOffer) {
            content = this.generateContentForMadeOffer();
        } else if (this.props.trade.requiresInputFromUser) {
            content = this.generateContentForReceivedOffer();
        } else if (this.props.trade.isMakingCounteroffer) {
            content = this.generateContentForCounterOffer();
        } else if (this.props.trade.isDeclined) {
            content = this.generateContentForDeclinedOffer();
        } else if (this.props.trade.isCompleted) {
            content = this.generateContentForCompletedTrade();
        } else if (this.props.trade.isCanceled) {
            content = this.generateContentForCanceledTrade();
        } else {
            content = this.generateContentForUnforeseenState();
        }

        return (
            <div className="base-page">
                {title}
                {this.renderEditButton()}
                {content}
            </div>
        );
    }
}

export default TradeDetail;