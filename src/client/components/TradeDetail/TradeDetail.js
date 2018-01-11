import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import Articles from '../Articles/Articles';
import ActionBox from '../ActionBox/ActionBox';

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
        withdrawTrade: PropTypes.func.isRequired,
        deleteTrade: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        trade: null
    };

    handleMakeOffer = () => {
        this.props.submitTrade();
    };

    handleEditOffer = () => {
        this.props.history.push(`/trade/edit/${this.props.trade._id}`);
    }

    handleDeleteOffer = () => {
        this.props.deleteTrade();
    }

    handleWithdrawOffer = () => {
        this.props.withdrawTrade();
    }

    handleAccept = () => {
        this.props.acceptTrade();
    }

    handleDecline = () => {
        this.props.declineTrade();
    }

    handleMakeCounteroffer = () => {
        this.handleEditOffer();
    }

    generateContentForNewTrade() {
        let tradePartnerArticlesTitle = `Du möchtest folgende Artikel von ${this.props.trade.tradePartner.name}:`;

        return (
            <div>
                <Articles articles={this.props.trade.tradePartnerArticles} title={tradePartnerArticlesTitle} />
                <Articles articles={this.props.trade.userArticles} title="Du bietest dafür folgende Artikel an:" />
                <section>
                    <div className="trade-detail__actions-container">
                        <ActionBox title="Senden" text="Sie können ">
                            <RaisedButton data-button-id="makeOffer" label="Senden" disabled={this.props.trade.cannotSubmit} onClick={this.handleMakeOffer} />
                        </ActionBox>
                        <ActionBox title="Bearbeiten" text="Sie haben den Handel [xy] nocht nicht unterbreitet. Sie können den Vorschlag bearbeiten.">
                            <RaisedButton data-button-id="editOffer" label="Bearbeiten" onClick={this.handleEditOffer} />
                        </ActionBox>
                        <ActionBox title="Löschen" text="Sie haben den Handel [xy] noch nicht unterbreitet. Sie können den Vorschlag löschen.">
                            <RaisedButton data-button-id="editOffer" label="Löschen" onClick={this.handleDeleteOffer} />
                        </ActionBox>
                    </div>
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
                    <div className="trade-detail__actions-container">
                        <ActionBox title="Den Angebot zurückziehen" text="Tauschvorschlag zurückziehen">
                            <RaisedButton data-button-id="withdrawOffer" label="Zurückziehen" onClick={this.handleWithdrawOffer}/>
                        </ActionBox>
                    </div>
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
                    <div className="trade-detail__actions-container">
                        <ActionBox title="Den Handel zustimmen" text="Zustimmen">
                            <RaisedButton data-button-id="accept" label="Zustimmen" onClick={this.handleAccept}/>
                        </ActionBox>
                        <ActionBox title="Den Angebot machen" text="Ablehnen">
                            <RaisedButton data-button-id="decline" label="Ablehnen" onClick={this.handleDecline}/>
                        </ActionBox>
                        <ActionBox title="Den Angebot machen" text="Angebot machen">
                            <RaisedButton data-button-id="makeCounteroffer" label="Gegenangebot erstellen" onClick={this.handleMakeCounteroffer}/>
                        </ActionBox>
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
                {content}
            </div>
        );
    }
}

export default TradeDetail;