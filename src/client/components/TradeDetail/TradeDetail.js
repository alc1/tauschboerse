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

    renderDescription(trade) {
        let content;
        
        if (trade) {
            if (trade.isNew) {
                content = `Dieses Tauschgeschäft ist neu. Sobald Du die gewünschten Artikel und die Artikel, die Du hergeben willst, zusammengestellt hast, kannst Du den Tauschvorschlag ${trade.tradePartner.name} unterbreiten.`;
            } else if (trade.isUserSender) {
                if (trade.isDeclined) {

                } else if (trade.isInvalidated) {

                } else {

                }
            } else {
                if (trade.isDeclined) {

                } else if (trade.isInvalidated) {

                } else {

                }
            }
        } else {
            content = 'Es gibt kein Tauschgeschäft mit der angegebenen Id.';
        }

        return content;
    }

    renderHints(trade) {
        let content = null;

        if (trade) {
            if (trade.isUserSender) {

            } else {

            }
        }

        return content;
    }

    renderArticles(trade) {
        let content = null;

        if (trade) {
            let offer = trade.isMakingCounteroffer ? trade.counteroffer : trade.currentOffer;

            if (trade.isUserSender) {
                content = (
                    <div>
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle} />
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle} />
                    </div>
                );
            } else if (trade.isUserReceiver) {
                content = (
                    <div>
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle} />
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle} />
                    </div>
                );
            }
        }

        return content;
    }

    renderActions(trade) {
        let content = null;

        if (trade) {
            if (trade.isNew) {
                content = (
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
                );
            } else if (trade.isUserSender) {
                if (trade.isInvalidated || trade.isDeclined) {
                    if (trade.isMakingCounteroffer) {
                        content = (
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
                        );
                    } else {
                        content = (
                            <div className="trade-detail__actions-container">
                                <ActionBox title="Den Angebot zurückziehen" text="Tauschvorschlag zurückziehen">
                                    <RaisedButton data-button-id="withdrawOffer" label="Zurückziehen" onClick={this.handleWithdrawOffer}/>
                                </ActionBox>
                                <ActionBox title="Ein Gegenangebot machen" text="Angebot machen">
                                    <RaisedButton data-button-id="makeCounteroffer" label="Gegenangebot erstellen" onClick={this.handleMakeCounteroffer}/>
                                </ActionBox>
                            </div>
                        );
                    }
                } else {
                    content = (
                        <div className="trade-detail__actions-container">
                            <ActionBox title="Den Angebot zurückziehen" text="Tauschvorschlag zurückziehen">
                                <RaisedButton data-button-id="withdrawOffer" label="Zurückziehen" onClick={this.handleWithdrawOffer}/>
                            </ActionBox>
                        </div>
                    );
                }
            } else if (trade.isUserReceiver) {
                if (!(trade.isDeclined || trade.isInvalidated)) {
                    if (trade.isMakingCounteroffer) {
                        content = (
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
                        );
                    } else {
                        content = (
                            <div className="trade-detail__actions-container">
                                <ActionBox title="Den Handel zustimmen" text="Zustimmen">
                                    <RaisedButton data-button-id="accept" label="Zustimmen" onClick={this.handleAccept}/>
                                </ActionBox>
                                <ActionBox title="Den Angebot ablehnen" text="Ablehnen">
                                    <RaisedButton data-button-id="decline" label="Ablehnen" onClick={this.handleDecline}/>
                                </ActionBox>
                                <ActionBox title="Ein Gegenangebot machen" text="Angebot machen">
                                    <RaisedButton data-button-id="makeCounteroffer" label="Gegenangebot erstellen" onClick={this.handleMakeCounteroffer}/>
                                </ActionBox>
                            </div>
                        );
                    }
                }
            } else {

            }
        }

        return content;
    }

    render() {
        const { trade } = this.props;
        const title = trade ? `Tauschgeschäft mit ${trade.tradePartner.name}` : 'Unbekanntes Tauschgeschäft';
        const description = this.renderDescription(trade);
        const hints = this.renderHints(trade);
        const articles = this.renderArticles(trade);
        const actions = this.renderActions(trade);

        return (
            <div className="base-page">
                <h1>{title}</h1>
                <div className="trade-detail__info-container">
                    <div className="trade-detail__description">{description}</div>
                    <div className="trade-detail__hints">{hints}</div>
                </div>
                {articles}
                {actions}
            </div>
        );
    }
}

export default TradeDetail;