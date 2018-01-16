import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import Articles from '../Articles/Articles';
import ActionBox from '../ActionBox/ActionBox';
import TradeStateTag from '../TradeStateTag/TradeStateTag';
import PageTitle from '../../containers/PageTitle';

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
    };

    handleMakeOffer = () => {
        this.props.onSubmitTrade();
    };

    handleEditOffer = () => {
        this.props.history.push(`/trade/edit/${this.props.trade._id}`);
    };

    handleDeleteOffer = () => {
        this.props.onDeleteTrade();
    };

    handleWithdrawOffer = () => {
        this.props.onWithdrawTrade();
    };

    handleAccept = () => {
        this.props.onAcceptTrade();
    };

    handleDecline = () => {
        this.props.onDeclineTrade();
    };

    handleMakeCounteroffer = () => {
        this.handleEditOffer();
    };

    handleDelivered = () => {
        this.props.onSetDelivered();
    };

    renderDescription(trade) {
        let content;
        // @Christian - eventuall können einige der Zustände zusammengefasst, d.h. bei gewissen Trade-Zuständen ist es vielleicht
        // egal, ob der User Sender oder Receiver ist. Am besten machen ein Refactoring, wenn die Texts erfasst sind.

        if (trade) {
            if (trade.isNew) {
                content = `Sobald Du die gewünschten Artikel und die Artikel, die Du dafür geben willst, zusammengestellt hast, kannst Du das Tauschangebot ${trade.tradePartner.name} unterbreiten.`;
            } else if (trade.isUserSender) {
                if (trade.isCompleted) {
                    if (trade.userHasDelivered) {
                        // trade was completed successfully and the user has sent the traded items
                        content = `Das Tauschgeschäft ist zustande gekommen und Du hast den Artikel bereits verschickt.`;
                    } else {
                        // trade was completed successfully but the user hasn't sent the traded items yet
                        content = `Das Tauschgeschäft ist zustande gekommen, aber Du hast den Artikel noch nicht verschickt.`;
                    }
                } else if (trade.isCanceled) {
                    content = `Das Tauschgeschäft wurde abgebrochen.`;
                } else if (trade.isDeclined) {
                    if (trade.userIsMakingCounteroffer) {
                        // Offer was declined by the trade partner, the user has now prepared a counteroffer, but hasn't sent it yet
                        content = 'd';
                    } else {
                        // Offer was declined by the trade partner, the user must now decide whether to make a counteroffer or cancel the trade
                        content = `Der Empfänger hat das Tauschangebot abgelehnt. Du kannst das Tauschgeschäft beenden, oder erneut einen Tauschangebot machen.`;
                    }
                } else if (trade.isInvalidated) {
                    if (trade.userIsMakingCounteroffer) {
                        // Offer was invalidated and the user has now prepared a counteroffer, but hasn't sent it yet
                        content = 'f';
                    } else {
                        // Offer was invalidated and the user must now decide whether to make a counteroffer or cancel the trade
                        content = 'g';
                    }
                } else {
                    // the user has sent a request and is waiting for an answer/reaction
                    content = `Du hast das Tauschangebot verschickt. Der Empfänger muss sich nun entscheiden. In der Zwischenzeit kannst Du dein Tauschangebot auch wieder zurückziehen.`;
                }
            } else if (trade.isUserReceiver) {
                if (trade.isCompleted) {
                    if (trade.userHasDelivered) {
                        // trade was completed successfully and the user has sent the traded items
                        content = `Das Tauschgeschäft ist zustande gekommen und Du hast den Artikel bereits verschickt.`;
                    } else {
                        // trade was completed successfully but the user hasn't sent the traded items yet
                        content = `Das Tauschgeschäft ist zustande gekommen, aber Du hast den Artikel noch nicht verschickt.`;
                    }
                } else if (trade.isCanceled) {
                    content = `Das Tauschgeschäft wurde abgebrochen.`;
                } else if (trade.isDeclined) {
                    // user has declined offer and is now waiting for a reaction from the other person
                    content = `Du hast die Tauschanfrage abgelehnt. Der Sender muss jetzt entscheiden, ob er das Tauschgeschäft beenden oder Dir ein neues Angebot machen will.`;
                } else if (trade.isInvalidated) {
                    // the offer was invalidated - the user has to wait to see what the other person (the sender) is going to do
                    content = 'm';
                } else {
                    if (trade.userIsMakingCounteroffer) {
                        // user has received a request and has prepared a counteroffer, but hasn't sent it yet
                        content = 'Dieser Gegenvorschlag ist in Bearbeitung. Schicke den ihn ab, sobald Du bereit dazu bist oder entferne ihn wieder.';
                    } else {
                        // user has received a request and must now decide how to respond/react
                        content = 'Du hast diese Tauschanfrage erhalten. Entscheide, was Du machen willst.'
                    }
                }
            }
        } else {
            content = 'Es gibt kein Tauschgeschäft mit der angegebenen Id.';
        }

        return content;
    }

    renderArticles(trade) {
        let content = null;

        if (trade) {
            let offer = trade.userIsMakingCounteroffer ? trade.counteroffer : trade.currentOffer;

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
                {actions.map((action, index) => (
                    <ActionBox key={index} title={action.title} text={action.text}>
                        <RaisedButton data-button-id={action.buttonId} style={buttonStyle} label={action.label} disabled={action.disabled} onClick={action.onClick} primary/>
                    </ActionBox>
                ))}
            </div>
        );
    }

    createMakeCounterofferAction(trade) {
        return (
            new ActionDescriptor('Gegenangebot machen', this.handleMakeCounteroffer, 'makeCounteroffer')
                .setText('Wenn Du nicht einverstanden bist, kannst Du auch ein Gegenangebot machen.')
                .setLabel('Gegenangebot erstellen')
        );
    }

    createRequestActions(trade) {
        return [
            new ActionDescriptor('Angebot abschicken', this.handleMakeOffer, 'makeOffer')
                .setText('Schicke dein Tauschangebot ab, sobald Du bereit bist.')
                .setLabel('Senden')
                .setDisabled(this.props.trade.cannotSubmit),

            new ActionDescriptor('Bearbeiten', this.handleEditOffer, 'editOffer')
                .setText('Du kannst dein Tauschangebot bearbeitet, weil Du es noch nicht versendet hast.'),

            new ActionDescriptor('Löschen', this.handleDeleteOffer, 'deleteOffer')
                .setText('Du kannst dein Tauschangebot immer noch löschen.')
        ];
    }

    createResponseActions(trade) {
        return [
            new ActionDescriptor('Angebot annehmen', this.handleAccept, 'accept')
                .setText('Nehme das Angebot an, damit das Tauschgeschäft zustande kommt.')
                .setLabel('Annehmen'),

            new ActionDescriptor('Angebot ablehnen', this.handleDecline, 'decline')
                .setText('Wenn Du nicht einverstanden bist, dann kannst Du das Angebot ablehnen.')
                .setLabel('Ablehnen'),

            // this.createMakeCounterofferAction(trade)
            new ActionDescriptor('Gegenangebot machen', this.handleMakeCounteroffer, 'makeCounteroffer')
                .setText('Wenn Du nicht einverstanden bist, kannst Du auch ein Gegenangebot machen.')
                .setLabel('Gegenangebot erstellen')
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
        if (canMakeCounteroffer) {
            return [
                new ActionDescriptor('Tauschgeschäft beenden', this.handleWithdrawOffer, 'withdrawOffer')
                    .setText('Der Empfänger hat dein Angebot abgelehnt. Beende das Tauschgeschäft, wenn Du kein neues Angebot machen willst.')
                    .setLabel('Beenden'),

                new ActionDescriptor('Neues Angebot', this.handleMakeCounteroffer, 'makeCounteroffer')
                    .setText('Der Empfänger hat dein Tauschangebot abgelehnt. Du kannst ein ihm ein neues Angebot machen.')
                    .setLabel('Angebot erstellen')
            ];
        }
        else {
            return [
                new ActionDescriptor('Angebot zurückziehen', this.handleWithdrawOffer, 'withdrawOffer')
                    .setText('Du kannst das Tauschangebot immer noch zurückziehen, weil sich der Empfänger noch nicht entschieden hat.')
                    .setLabel('Zurückziehen')
            ];
        }

        // let actions = [
        //     new ActionDescriptor('Angebot zurückziehen', this.handleWithdrawOffer, 'withdrawOffer')
        //         .setText('Du kannst das Tauschangebot immer noch zurückziehen, weil sich der Empfänger noch nicht entschieden hat.')
        //         .setLabel('Zurückziehen')
        // ];
        //
        // if (canMakeCounteroffer) {
        //     // actions.push(this.createMakeCounterofferAction(trade));
        //     actions.push(
        //         new ActionDescriptor('Neues Angebot', this.handleMakeCounteroffer, 'makeCounteroffer')
        //             .setText('Der Empfänger hat dein Tauschangebot abgelehnt. Du kannst ein ihm ein neues Angebot machen.')
        //             .setLabel('Angebot erstellen')
        //     );
        // }
        //
        // return actions;
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
                    if (trade.userIsMakingCounteroffer) {
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
                    if (trade.userIsMakingCounteroffer) {
                        actions = this.createRequestActions(trade);
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
                <PageTitle>{title}</PageTitle>
                {this.renderUpdateMessage()}
                <Paper className="trade-detail__info-container">
                    <TradeStateTag status={trade.state}/>
                    <span className="trade-detail__description">{this.renderDescription(trade)}</span>
                </Paper>
                {this.renderArticles(trade)}
                {this.renderActions(trade)}
            </div>
        );
    }
}

export default TradeDetail;