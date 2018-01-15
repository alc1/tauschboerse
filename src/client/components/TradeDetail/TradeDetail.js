import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import Articles from '../Articles/Articles';
import ActionBox from '../ActionBox/ActionBox';

import ActionDescriptor from '../../model/ActionDescriptor';

import './TradeDetail.css';

// overridden styles on buttons in ActionBoxes
const buttonStyle = { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' };

class TradeDetail extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        newVersionAvailable: PropTypes.bool.isRequired,
        onAcceptTrade: PropTypes.func.isRequired,
        onDeclineTrade: PropTypes.func.isRequired,
        onDeleteTrade: PropTypes.func.isRequired,
        onRefresh: PropTypes.func.isRequired,
        onSetDelivered: PropTypes.func.isRequired,
        onSubmitTrade: PropTypes.func.isRequired,
        onWithdrawTrade: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired
    };

    static defaultProps = {
        trade: null,
        newVersionAvailable: false
    };

    handleUpdate = () => {
        this.props.onRefresh();
    }

    handleMakeOffer = () => {
        this.props.onSubmitTrade();
    };

    handleEditOffer = () => {
        this.props.history.push(`/trade/edit/${this.props.trade._id}`);
    }

    handleDeleteOffer = () => {
        this.props.onDeleteTrade();
    }

    handleWithdrawOffer = () => {
        this.props.onWithdrawTrade();
    }

    handleAccept = () => {
        this.props.onAcceptTrade();
    }

    handleDecline = () => {
        this.props.onDeclineTrade();
    }

    handleMakeCounteroffer = () => {
        this.handleEditOffer();
    }

    handleDelivered = () => {
        this.props.onSetDelivered();
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
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle()} />
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle()} />
                    </div>
                );
            } else if (trade.isUserReceiver) {
                content = (
                    <div>
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle()} />
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle()} />
                    </div>
                );
            }
        }

        return content;
    }

    // turns a list of ActionDescriptors into a list ActionBoxes in a container for displaying
    renderActionBoxes(actions) {
        return (
            <div className="trade-detail__actions-container">
                {actions.map(action => (
                    <ActionBox title={action.title} text={action.text}>
                        <RaisedButton data-button-id={action.buttonId} style={buttonStyle} label={action.label} disabled={action.disabled} onClick={action.onClick} />
                    </ActionBox>
                ))}
            </div>
        );
    }

    createMakeCounterofferAction(trade) {
        return (
            new ActionDescriptor('Ein Gegenangebot machen', this.handleMakeCounteroffer, 'makeCounteroffer')
                .setText('Angebot machen')
                .setLabel('Gegenangebot erstellen')
        );
    }

    createRequestActions(trade) {
        return [
            new ActionDescriptor('Senden', this.handleMakeOffer, 'makeOffer')
                .setText('')
                .setDisabled(this.props.trade.cannotSubmit),

            new ActionDescriptor('Bearbeiten', this.handleEditOffer, 'editOffer')
                .setText(''),

            new ActionDescriptor('Löschen', this.handleDeleteOffer, 'deleteOffer')
                .setText('')
        ];
    }

    createResponseActions(trade) {
        return [
            new ActionDescriptor('Den Handel zustimmen', this.handleAccept, 'accept')
                .setText('Zustimmen')
                .setLabel('Zustimmen'),

            new ActionDescriptor('Den Angebot ablehnen', this.handleDecline, 'decline')
                .setText('Ablehnen')
                .setLabel('Ablehnen'),

            this.createMakeCounterofferAction(trade)
        ];
    }

    createDeliverActions(trade) {
        return [
            new ActionDescriptor('Die Artikel abgeben', this.handleDelivered, 'delivered')
                .setText(`Wenn Du Deine Artikel ${trade.tradePartner.name} gesendet hast, kannst Du hier angeben, dass sie auf dem Weg sind.`)
                .setLabel('Artikel abgeben')
        ];
    }

    createWithrawActions(trade, canMakeCounteroffer) {
        let actions = [
            new ActionDescriptor('Den Angebot zurückziehen', this.handleWithdrawOffer, 'withdrawOffer')
                .setText('Tauschvorschlag zurückziehen')
                .setLabel('Zurückziehen')
        ];

        if (canMakeCounteroffer) {
            actions.push(this.createMakeCounterofferAction(trade));
        }

        return actions;
    }

    renderActions(trade) {
        let actions;

        if (trade) {
            // define the actions relevant to the trades state and the user's role in the trade
            if (trade.isNew) {
                actions = this.createRequestActions(trade);
            } else if (trade.isUserSender) {
                if (trade.isFinished) {
                    if (trade.isCompleted && !trade.userHasDelivered) {
                        actions = this.createDeliverActions(trade);
                    }
                } else if (trade.isInvalidated || trade.isDeclined) {
                    if (trade.isMakingCounteroffer) {
                        actions = this.createRequestActions(trade);
                    } else {
                        actions = this.createWithrawActions(trade, true);
                    }
                } else {
                    actions = this.createWithrawActions(trade, false)
                }
            } else if (trade.isUserReceiver) {
                if (trade.isFinished) {
                    if (trade.isCompleted && !trade.userHasDelivered) {
                        actions = this.createDeliverActions(trade);
                    }
                } else if (!(trade.isDeclined || trade.isInvalidated)) {
                    if (trade.isMakingCounteroffer) {
                        actions = this.createCreatingOfferActions(trade);
                    } else {
                        actions = this.createResponseActions(trade);
                    }
                }
            }
        }

        // if any actions defined render the corresponding ActionBoxes
        return (actions) ? this.renderActionBoxes(actions) : null;
    }

    renderUpdateMessage() {
        let content = null;

        if (this.props.newVersionAvailable) {
            content = (
                <div className="trade-detail__update-message">
                    <RaisedButton label="Aktualisieren" onClick={this.handleUpdate} /><span style={{marginLeft: '20px'}}>Das Tauschgeschäft wurde verändert - Du kannst die Anzeige aktualisieren</span>
                </div>
            );
        }

        return content;
    }

    render() {
        const { trade } = this.props;
        const title = trade ? `Tauschgeschäft mit ${trade.tradePartner.name}` : 'Unbekanntes Tauschgeschäft';

        return (
            <div>
                <h1>{title}</h1>
                {this.renderUpdateMessage()}
                <div className="trade-detail__info-container">
                    <div className="trade-detail__description">{this.renderDescription(trade)}</div>
                    <div className="trade-detail__hints">{this.renderHints(trade)}</div>
                </div>
                {this.renderArticles(trade)}
                {this.renderActions(trade)}
            </div>
        );
    }
}

export default TradeDetail;