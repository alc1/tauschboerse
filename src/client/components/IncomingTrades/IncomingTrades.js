import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';

import Placeholder from '../../containers/Placeholder';
import TradesList from '../TradesList/TradesList';

import './IncomingTrades.css';

const toolbarStyle = { width: '100%' };
const toolbarTitleStyle = { color: 'black' };

export default class IncomingTrades extends React.Component {

    static propTypes = {
        trades: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired
    };

    showTrade = (theTrade) => {
        this.props.history.push(`/trade/show/${theTrade._id}`);
    };

    createTradeAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    createTradeActions = () => {
        return [
            this.createTradeAction("Tauschgeschäft ansehen", <ShowIcon/>, this.showTrade, true, false, true)
        ];
    };

    render() {
        const { trades, loading } = this.props;

        return (
            <Paper className="incoming-trades">
                <Toolbar style={toolbarStyle}>
                    <ToolbarGroup>
                        <ToolbarTitle style={toolbarTitleStyle} text={trades.hasTradesRequiringAttention ? 'Bei diesen Tauschgeschäften musst Du handeln' : 'Offene Tauschanfragen'}/>
                    </ToolbarGroup>
                </Toolbar>
                {trades.hasTradesRequiringAttention ? (
                    <TradesList trades={trades.tradesRequiringAttention} loading={loading} tradeActions={this.createTradeActions()}/>
                ) : (
                    <Placeholder width={100} height={100} loading={loading} isVertical={false} text="Keine Aktionen erforderlich" loadingText="... Tauschgeschäfte werden geladen ..."/>
                )}
            </Paper>
        );
    }
}
