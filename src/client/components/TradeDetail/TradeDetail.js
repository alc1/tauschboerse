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
        userArticles: PropTypes.object.isRequired,
        partnerArticles: PropTypes.object.isRequired,
        loading: PropTypes.bool,
        setLoading: PropTypes.func.isRequired,
        startEditingUserArticles: PropTypes.func,
        cancelEditingUserArticles: PropTypes.func,
        saveUserArticles: PropTypes.func,
        toggleUserArticle: PropTypes.func,
        startEditingPartnerArticles: PropTypes.func,
        cancelEditingPartnerArticles: PropTypes.func,
        savePartnerArticles: PropTypes.func,
        togglePartnerArticle: PropTypes.func,
    };

    static defaultProps = {
        trade: null
    };

    // state = {
    // };

    startEditingUserArticles = () => {
        if (!this.props.userArticles.isEditing && this.props.trade.canEdit && (typeof this.props.startEditingUserArticles === 'function')) {
            var promise;
            if (!this.props.userArticles.all) {
                promise = this.props.loadUserArticles(this.props.user._id);
            } else {
                promise = Promise.resolve(null);
            }
            promise.then(() => { this.props.startEditingUserArticles(); }).catch(() => {});
        }
    };

    startEditingPartnerArticles = () => {
        if (!this.props.partnerArticles.isEditing && this.props.trade.canEdit && (typeof this.props.startEditingPartnerArticles === 'function')) {
            var promise;
            if (!this.props.partnerArticles.all) {
                promise = this.props.loadPartnerArticles(this.props.trade.tradePartner._id);
            } else {
                promise = Promise.resolve(null);
            }
            promise.then(() => { this.props.startEditingPartnerArticles(); }).catch(() => {});
        }
    };

    angebotMachen = () => { };

    generateContentForNewTrade() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <ChosenArticles chosenArticles={this.props.partnerArticles.chosen} allArticles={this.props.partnerArticles.all} title={tradePartnerArticlesTitle} canEdit={this.props.trade.canEdit} isEditing={this.props.partnerArticles.isEditing} startEditing={this.startEditingPartnerArticles} cancelEditing={this.props.cancelEditingPartnerArticles} saveArticles={this.props.savePartnerArticles} toggleArticle={this.props.togglePartnerArticle} />
                <ChosenArticles chosenArticles={this.props.userArticles.chosen} allArticles={this.props.userArticles.all} title="Du bietest dafür folgende Artikel an:" canEdit={this.props.trade.canEdit}  isEditing={this.props.userArticles.isEditing} startEditing={this.startEditingUserArticles} cancelEditing={this.props.cancelEditingUserArticles} saveArticles={this.props.saveUserArticles} toggleArticle={this.props.toggleUserArticle} />
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
                <ChosenArticles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} loading={this.props.loading} />
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
                {content}
            </div>
        );
    }
}

export default TradeDetail;