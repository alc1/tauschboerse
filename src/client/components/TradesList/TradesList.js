import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import Placeholder from '../../containers/Placeholder';
import TradeSummary from '../TradeSummary/TradeSummary';

import './TradesList.css';

export default class TradesList extends React.Component {

    static propTypes = {
        trades: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        tradeActions: PropTypes.array.isRequired
    };

    static defaultProps = {
        tradeActions: []
    };

    createActionButton = (theAction, theTrade, theIndex) => {
        const isPrimary = theAction.isPrimary;
        const isSecondary = theAction.isSecondary;
        if (theAction.isRaised) {
            return (<RaisedButton key={theIndex} icon={theAction.icon} label={theAction.label} onClick={theAction.onClick.bind(this, theTrade)} primary={isPrimary} secondary={isSecondary}/>);
        }
        else {
            return (<FlatButton key={theIndex} icon={theAction.icon} label={theAction.label} onClick={theAction.onClick.bind(this, theTrade)} primary={isPrimary} secondary={isSecondary}/>);
        }
    };

    createActionButtons = (theTrade, theTradeActions) => {
        let actionButtons = [];
        theTradeActions.forEach(tradeAction => actionButtons.push(this.createActionButton(tradeAction, theTrade, actionButtons.length)));
        return actionButtons;
    };

    generateTradeList = () => {
        const { tradeActions } = this.props;
        return this.props.trades.map(trade => {
            return (
                <TradeSummary key={trade._id} trade={trade} loading={this.props.loading} actions={this.createActionButtons(trade, tradeActions)}/>
            );
        });
    };

    hasTrades() {
        return this.props.trades ? this.props.trades.length > 0 : false;
    }

    render() {
        const { loading } = this.props;
        let tradeList = this.hasTrades() ? this.generateTradeList() : <Placeholder width={300} height={300} loading={loading} text="Keine Tauschgeschäfte gefunden" loadingText="... Tauschgeschäfte werden geladen ..."/>;
        return (
            <div className="trade-list">
                {tradeList}
            </div>
        );
    }
}
