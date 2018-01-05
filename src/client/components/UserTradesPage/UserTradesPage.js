import React from 'react';
import PropTypes from 'prop-types';

import { Step, Stepper, StepButton, StepContent, StepLabel } from 'material-ui/Stepper';

import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import SectionClosedIcon from 'material-ui/svg-icons/av/play-circle-filled';
import SectionOpenedIcon from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import ApplicationBar from '../../containers/ApplicationBar';
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

    render() {
        const { user, loading, userTradesSectionIndex, muiTheme } = this.props;
        const trades = new TradesModel(this.props.trades, user);

        return (
            <div>
                <ApplicationBar subtitle="Meine Tauschgeschäfte verwalten"/>
                <Stepper
                    activeStep={userTradesSectionIndex}
                    linear={false}
                    orientation="vertical">
                    <Step>
                        <StepButton icon={userTradesSectionIndex === 0 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, 0)}>
                            <StepLabel>{`Noch nicht gesendete Tauschgeschäfte in Vorbereitung (${trades.newTrades.length})`}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <TradesList trades={trades.newTrades} loading={loading} tradeActions={this.buildActionList()}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton icon={userTradesSectionIndex === 1 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, 1)}>
                            <StepLabel>{`Tauschgeschäfte, die auf meine Antwort warten (${trades.receivedTrades.length})`}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <TradesList trades={trades.receivedTrades} loading={loading} tradeActions={this.buildActionList()}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton icon={userTradesSectionIndex === 2 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, 2)}>
                            <StepLabel>{`Tauschgeschäfte, die auf Antwort des Empfängers warten (${trades.sentTrades.length})`}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <TradesList trades={trades.sentTrades} loading={loading} tradeActions={this.buildActionList()}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton icon={userTradesSectionIndex === 3 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, 3)}>
                            <StepLabel>{`Erfolgreich abgeschlossene Tauschgeschäfte (${trades.completedTrades.length})`}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <TradesList trades={trades.completedTrades} loading={loading} tradeActions={this.buildActionList()}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepButton icon={userTradesSectionIndex === 4 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, 4)}>
                            <StepLabel>{`Abgebrochene Tauschgeschäfte (${trades.canceledTrades.length})`}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <TradesList trades={trades.canceledTrades} loading={loading} tradeActions={this.buildActionList()}/>
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
    }
}
