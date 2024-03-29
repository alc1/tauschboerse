import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';

import SendIcon from 'material-ui/svg-icons/content/send';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import CounterOfferIcon from 'material-ui/svg-icons/content/reply';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import WithdrawIcon from 'material-ui/svg-icons/navigation/cancel';
import AcceptIcon from 'material-ui/svg-icons/action/done-all';
import ShippingIcon from 'material-ui/svg-icons/maps/local-shipping';
import NewOfferIcon from 'material-ui/svg-icons/content/add';
import ContactIcon from 'material-ui/svg-icons/communication/contact-mail';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import Articles from '../Articles/Articles';
import ActionBox from '../ActionBox/ActionBox';
import TradeStateTag from '../TradeStateTag/TradeStateTag';
import AvatarTag from '../AvatarTag/AvatarTag';
import PageTitle from '../../containers/PageTitle';

import ActionDescriptor from '../../model/ActionDescriptor';

import './TradeDetail.css';

// overridden styles on buttons in ActionBoxes
const buttonStyle = { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' };

class TradeDetail extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        onAcceptTrade: PropTypes.func.isRequired,
        onDeclineTrade: PropTypes.func.isRequired,
        onDeleteTrade: PropTypes.func.isRequired,
        onSetDelivered: PropTypes.func.isRequired,
        onSubmitTrade: PropTypes.func.isRequired,
        onWithdrawTrade: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired
    };

    static defaultProps = {
        trade: null
    };

    state = {
        isContactDetailOpen: false
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

    handleContactDetail = (isOpen) => {
        this.setState({
            isContactDetailOpen: isOpen
        });
    };

    renderDescription(trade) {
        let content;

        if (trade) {
            if (trade.isNew) {
                content = `Sobald Du die gewünschten Artikel und die Artikel, die Du dafür geben willst, zusammengestellt hast, kannst Du das Tauschangebot ${trade.tradePartner.name} unterbreiten.`;
            } else if (trade.isUserSender) {
                if (trade.isCompleted) {
                    if (trade.userHasDelivered) {
                        // trade was completed successfully and the user has sent the traded items
                        content = `Das Tauschgeschäft ist zustande gekommen und Du hast die Artikel bereits ausgeliefert.`;
                    } else {
                        // trade was completed successfully but the user hasn't sent the traded items yet
                        content = `Das Tauschgeschäft ist zustande gekommen, aber Du hast die Artikel noch nicht ausgeliefert.`;
                    }
                } else if (trade.isCanceled) {
                    content = `Das Tauschgeschäft wurde abgebrochen.`;
                } else if (trade.isDeclined) {
                    if (trade.userIsMakingCounteroffer) {
                        // Offer was declined by the trade partner, the user has now prepared a counteroffer, but hasn't sent it yet
                        content = 'Der Empfänger hat das Tauschangebot abgelehnt. Du hast aber dieses neue Angebot in Vorbereitung, welches Du abschicken, bearbeiten oder immer noch löschen kannst.';
                    } else {
                        // Offer was declined by the trade partner, the user must now decide whether to make a counteroffer or cancel the trade
                        content = `Der Empfänger hat das Tauschangebot abgelehnt. Du kannst das Tauschgeschäft beenden, oder erneut einen Angebot machen.`;
                    }
                } else if (trade.isInvalidated) {
                    if (trade.userIsMakingCounteroffer) {
                        // Offer was invalidated and the user has now prepared a counteroffer, but hasn't sent it yet
                        content = 'Das Tauschangebot ist nicht mehr gültig. Du hast aber dieses neue Angebot in Vorbereitung, welches Du abschicken, bearbeiten oder immer noch löschen kannst.';
                    } else {
                        // Offer was invalidated and the user must now decide whether to make a counteroffer or cancel the trade
                        content = 'Das Tauschangebot ist nicht mehr gültig. Möglicherweise wurde ein Artikel bereits vergeben oder gelöscht. Entscheide, ob Du das Tauschgeschäft beenden oder ein neues Angebot machen willst.';
                    }
                } else {
                    // the user has sent a request and is waiting for an answer/reaction
                    content = `Du hast das Tauschangebot verschickt. Der Empfänger muss sich nun entscheiden. In der Zwischenzeit kannst Du dein Tauschangebot auch wieder zurückziehen.`;
                }
            } else if (trade.isUserReceiver) {
                if (trade.isCompleted) {
                    if (trade.userHasDelivered) {
                        // trade was completed successfully and the user has sent the traded items
                        content = `Das Tauschgeschäft ist zustande gekommen und Du hast die Artikel bereits ausgeliefert.`;
                    } else {
                        // trade was completed successfully but the user hasn't sent the traded items yet
                        content = `Das Tauschgeschäft ist zustande gekommen, aber Du hast die Artikel noch nicht ausgeliefert.`;
                    }
                } else if (trade.isCanceled) {
                    content = `Das Tauschgeschäft wurde abgebrochen.`;
                } else if (trade.isDeclined) {
                    // user has declined offer and is now waiting for a reaction from the other person
                    content = `Du hast die Tauschanfrage abgelehnt. Der Sender muss jetzt entscheiden, ob er das Tauschgeschäft beenden oder Dir ein neues Angebot machen will.`;
                } else if (trade.isInvalidated) {
                    // the offer was invalidated - the user has to wait to see what the other person (the sender) is going to do
                    content = 'Das Tauschangebot ist nicht mehr gültig. Möglicherweise wurde ein Artikel bereits vergeben oder gelöscht. Warte bis der Sender entschieden hat, ob er Dir ein neues Angebot machen will.';
                } else {
                    if (trade.userIsMakingCounteroffer) {
                        // user has received a request and has prepared a counteroffer, but hasn't sent it yet
                        content = 'Dieser Gegenvorschlag ist in Bearbeitung. Schicke ihn ab, sobald Du bereit dazu bist oder entferne ihn wieder.';
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
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle()} withArticleLink={true}/>
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle()} withArticleLink={true}/>
                    </div>
                );
            } else if (trade.isUserReceiver) {
                content = (
                    <div>
                        <Articles articles={offer.userArticles} title={trade.userArticlesListTitle()} withArticleLink={true}/>
                        <Articles articles={offer.tradePartnerArticles} title={trade.partnerArticlesListTitle()} withArticleLink={true}/>
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
                        <RaisedButton data-button-id={action.buttonId} style={buttonStyle} label={action.label} disabled={action.disabled} onClick={action.onClick} icon={action.icon} primary/>
                    </ActionBox>
                ))}
            </div>
        );
    }

    createRequestActions() {
        return [
            new ActionDescriptor('Angebot abschicken', this.handleMakeOffer, 'makeOffer')
                .setText('Schicke dein Tauschangebot ab, sobald Du bereit bist.')
                .setLabel('Senden')
                .setDisabled(this.props.trade.cannotSubmit)
                .setIcon(<SendIcon/>),

            new ActionDescriptor('Bearbeiten', this.handleEditOffer, 'editOffer')
                .setText('Du kannst dein Tauschangebot bearbeitet, weil Du es noch nicht versendet hast.')
                .setIcon(<EditIcon/>),

            new ActionDescriptor('Löschen', this.handleDeleteOffer, 'deleteOffer')
                .setText('Du kannst dein Tauschangebot immer noch löschen.')
                .setIcon(<DeleteIcon/>)
        ];
    }

    createResponseActions() {
        return [
            new ActionDescriptor('Angebot annehmen', this.handleAccept, 'accept')
                .setText('Nehme das Angebot an, damit das Tauschgeschäft zustande kommt.')
                .setLabel('Annehmen')
                .setIcon(<AcceptIcon/>),

            new ActionDescriptor('Angebot ablehnen', this.handleDecline, 'decline')
                .setText('Wenn Du nicht einverstanden bist, dann kannst Du das Angebot ablehnen.')
                .setLabel('Ablehnen')
                .setIcon(<WithdrawIcon/>),

            new ActionDescriptor('Gegenangebot machen', this.handleMakeCounteroffer, 'makeCounteroffer')
                .setText('Wenn Du nicht einverstanden bist, kannst Du auch ein Gegenangebot machen.')
                .setLabel('Gegenangebot erstellen')
                .setIcon(<CounterOfferIcon/>)
        ];
    }

    createDeliverActions(trade) {
        return [
            new ActionDescriptor('Artikel ausliefern', this.handleDelivered, 'delivered')
                .setText(`Wenn Du deine Artikel ${trade.tradePartner.name} ausgeliefert hast, kannst Du hier angeben, dass sie auf dem Weg sind.`)
                .setLabel('Artikel ausliefern')
                .setIcon(<ShippingIcon/>),

            new ActionDescriptor('Kontakt aufnehmen', this.handleContactDetail.bind(this, true), 'contacting')
                .setText(`Nehme mit ${trade.tradePartner.name} Kontakt auf, damit Ihr den Austausch der Artikel organisieren könnt.`)
                .setLabel('Kontaktdetails')
                .setIcon(<ContactIcon/>)
        ];
    }

    createWithrawActions(canMakeCounteroffer) {
        if (canMakeCounteroffer) {
            return [
                new ActionDescriptor('Tauschgeschäft beenden', this.handleWithdrawOffer, 'withdrawOffer')
                    .setText('Beende das Tauschgeschäft, wenn Du kein neues Angebot machen willst.')
                    .setLabel('Beenden')
                    .setIcon(<WithdrawIcon/>),

                new ActionDescriptor('Neues Angebot', this.handleMakeCounteroffer, 'makeCounteroffer')
                    .setText('Du kannst ein neues Tauschangebot machen.')
                    .setLabel('Angebot erstellen')
                    .setIcon(<NewOfferIcon/>)
            ];
        }
        else {
            return [
                new ActionDescriptor('Angebot zurückziehen', this.handleWithdrawOffer, 'withdrawOffer')
                    .setText('Du kannst das Tauschangebot immer noch zurückziehen, weil sich der Empfänger noch nicht entschieden hat.')
                    .setLabel('Zurückziehen')
                    .setIcon(<WithdrawIcon/>)
            ];
        }
    }

    renderActions(trade) {
        let actions;

        if (trade) {
            // define the actions relevant to the trades state and the user's role in the trade
            if (trade.isNew) {
                actions = this.createRequestActions();
            } else if (trade.isUserSender) {
                if (trade.isFinished) {
                    if (trade.isCompleted && !trade.userHasDelivered) {
                        actions = this.createDeliverActions(trade);
                    }
                } else if (trade.isInvalidated || trade.isDeclined) {
                    if (trade.userIsMakingCounteroffer) {
                        actions = this.createRequestActions();
                    } else {
                        actions = this.createWithrawActions(true);
                    }
                } else {
                    actions = this.createWithrawActions(false)
                }
            } else if (trade.isUserReceiver) {
                if (trade.isFinished) {
                    if (trade.isCompleted && !trade.userHasDelivered) {
                        actions = this.createDeliverActions(trade);
                    }
                } else if (!(trade.isDeclined || trade.isInvalidated)) {
                    if (trade.userIsMakingCounteroffer) {
                        actions = this.createRequestActions();
                    } else {
                        actions = this.createResponseActions();
                    }
                }
            }
        }

        // if any actions defined render the corresponding ActionBoxes
        return (actions) ? this.renderActionBoxes(actions) : null;
    }

    render() {
        const { trade } = this.props;
        const { isContactDetailOpen } = this.state;
        const title = trade ? `Tauschgeschäft mit ${trade.tradePartner.name}` : 'Unbekanntes Tauschgeschäft';

        return (
            <div>
                <PageTitle>{title}</PageTitle>
                <Paper className="trade-detail__info-container">
                    <TradeStateTag status={trade.state}/>
                    <span className="trade-detail__description">{this.renderDescription(trade)}</span>
                </Paper>
                {this.renderArticles(trade)}
                {this.renderActions(trade)}
                <Dialog
                    open={isContactDetailOpen}
                    title="Kontakdetails"
                    modal={true}
                    actions={[
                        <RaisedButton label="OK" onClick={this.handleContactDetail.bind(this, false)} primary/>
                    ]}>
                    <AvatarTag text={trade.tradePartner.name} icon={<AccountIcon/>}/>
                    <div className="trade-detail__contact-info">{trade.tradePartner.address}</div>
                    <div className="trade-detail__contact-info">
                        <a href={`mailto:${trade.tradePartner.email}`}>{trade.tradePartner.email}</a>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default TradeDetail;
