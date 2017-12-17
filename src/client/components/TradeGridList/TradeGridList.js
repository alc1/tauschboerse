import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TradeComponent from '../TradeComponent/TradeComponent';

import './TradeGridList.css';

export default class TradeGridList extends React.Component {

    static propTypes = {
        trades: PropTypes.array.isRequired,
        actions: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        actions: []
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

    render() {
        const { trades, actions, loading } = this.props;
        const hasTrades = trades && trades.length > 0;
        const tradeComponents = trades.map(trade => <TradeComponent key={trade._id} trade={trade} actions={this.createActionButtons(trade, actions)}/>);
        return (
            <div className="trade-grid-list">
                {hasTrades ? tradeComponents : <div>keine Tauschgescäfte</div>}
            </div>
        );
    }
}
