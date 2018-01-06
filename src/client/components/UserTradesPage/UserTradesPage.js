import React from 'react';
import PropTypes from 'prop-types';

import { Step, Stepper, StepButton, StepContent, StepLabel } from 'material-ui/Stepper';

import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import SectionClosedIcon from 'material-ui/svg-icons/av/play-circle-filled';
import SectionOpenedIcon from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../../containers/Placeholder';
import TradesList from '../TradesList/TradesList';

import TradesModel from '../../model/TradesModel';

export default class UserTradesPage extends React.Component {

    static propTypes = {
        trades: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        userTradesSectionIndex: PropTypes.number.isRequired,
        loadUserTrades: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        openUserTradesSection: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired,
        muiTheme: PropTypes.shape({
            palette: PropTypes.shape({
                primary1Color: PropTypes.string.isRequired,
            }).isRequired
        }).isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserTrades(userId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    showTradeDetails = (theTrade) => {
        this.props.history.push(`/trade/show/${theTrade._id}`);
    };

    createTradeAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    buildActionList = () => {
        return [
            this.createTradeAction("Tauschgeschäft ansehen", <ShowIcon/>, this.showTradeDetails, true, false, true)
        ];
    };

    onSectionClick = (theUserTradesSectionIndex) => {
        this.props.openUserTradesSection(theUserTradesSectionIndex === this.props.userTradesSectionIndex ? -1 : theUserTradesSectionIndex);
    };

    createTradesSection = (theSectionIndex, theCurrentUserTradesSectionIndex, theTrades, theSectionTitle) => {
        const { loading, muiTheme } = this.props;
        return (
            <Step>
                <StepButton icon={theCurrentUserTradesSectionIndex === theSectionIndex ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, theSectionIndex)}>
                    <StepLabel>{`${theSectionTitle} (${theTrades.length})`}</StepLabel>
                </StepButton>
                <StepContent transitionDuration={0}>
                    <TradesList trades={theTrades} loading={loading} tradeActions={this.buildActionList()}/>
                </StepContent>
            </Step>
        );
    };

    render() {
        const { user, loading, userTradesSectionIndex } = this.props;
        const trades = new TradesModel(this.props.trades, user);

        return (
            <div>
                <ApplicationBar subtitle="Meine Tauschgeschäfte verwalten"/>
                {trades.count > 0 ? (
                    <Stepper
                        activeStep={userTradesSectionIndex}
                        linear={false}
                        orientation="vertical">
                        {trades.hasNewTrades && this.createTradesSection(0, userTradesSectionIndex, trades.newTrades, 'Noch nicht gesendete Tauschgeschäfte in Vorbereitung')}
                        {trades.hasReceivedTrades && this.createTradesSection(1, userTradesSectionIndex, trades.receivedTrades, 'Tauschgeschäfte, die auf meine Antwort warten')}
                        {trades.hasSentTrades && this.createTradesSection(2, userTradesSectionIndex, trades.sentTrades, 'Tauschgeschäfte, die auf Antwort des Empfängers warten')}
                        {trades.hasCompletedTrades && this.createTradesSection(3, userTradesSectionIndex, trades.completedTrades, 'Erfolgreich abgeschlossene Tauschgeschäfte')}
                        {trades.hasCanceledTrades && this.createTradesSection(4, userTradesSectionIndex, trades.canceledTrades, 'Abgebrochene Tauschgeschäfte')}
                    </Stepper>
                ) : (
                    <Placeholder width={300} height={300} loading={loading} text="Keine Tauschgeschäfte vorhanden" loadingText="... Tauschgeschäfte werden geladen ..."/>
                )}
            </div>
        );
    }
}
