import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TradeAction from '../../constants/TradeAction';
import ChosenArticles from '../ChosenArticles/ChosenArticles';

import './TradeDetail.css';

class TradeDetail extends React.Component {

    static propTypes = {
        trade: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        onAction: PropTypes.func.isRequired,
        loading: PropTypes.bool
    };

    static defaultProps = {
        trade: null
    };

    state = {
        isEditingWantedArticles: false,
        isEditingOfferedArticles: false
    };

    doAction(theAction) {
        this.props.onAction(theAction);
    }

    generateContentForNewTrade() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <ChosenArticles articles={this.props.trade.tradePartnerArticles} user={this.props.trade.tradePartner} title={tradePartnerArticlesTitle} canEdit={true} isEditing={this.state.isEditingWantedArticles} onAction={this.onAction} loading={this.props.loading} />
                <ChosenArticles articles={this.props.trade.userArticles} user={this.props.user} title="Du bietest dafür folgende Artikel an:" canEdit={true} isEditing={this.state.isEditingOfferedArticles} onAction={this.onAction} loading={this.props.loading} />
                <section>
                    <div><button type="button" onClick={this.doAction.bind(this, TradeAction.TRADE_ACTION_SUBMIT)}>Angebot machen</button></div>
                </section>
            </div>
        );
    }
    
    generateContentForMadeOffer() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <ChosenArticles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} loading={this.props.loading} />
                <ChosenArticles articles={this.props.trade.userArticles} title="Du hast dafür folgende Artikel angeboten:" loading={this.props.loading} />
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
                <ChosenArticles articles={this.props.trade.userArticles} title={tradePartnerArticlesTitle} loading={this.props.loading} />
                <ChosenArticles articles={this.props.trade.userArticles} title="Dafür bietet er/sie Dir folgende Artikel an:" loading={this.props.loading} />
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

    render() {
        let title = this.props.trade ? <h1>Tauschgeschäft mit {this.props.trade.tradePartner.name}</h1> : <h1>Unbekanntes Tauschgescäft</h1>;
        let content = null;
        if (this.props.trade.isNew) {
            content = this.generateContentForNewTrade();
        } else if (this.props.trade.hasMadeCurrentOffer) {
            content = this.generateContentForMadeOffer();
        } else if (this.props.trade.requiresInputFromUser) {
            content = this.generateContentForReceivedOffer();
        } else if (this.props.trade.isMakingCounterOffer) {
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
            <div>
                {title}
                {content}
            </div>
        );
    }
}

export default TradeDetail;