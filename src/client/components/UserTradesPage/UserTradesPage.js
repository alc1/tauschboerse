import React from 'react';
import PropTypes from 'prop-types';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeGridList from '../TradeGridList/TradeGridList';
import TradeModel from '../../model/TradeModel';

export default class UserTradesPage extends React.Component {

    static propTypes = {
        trades: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loadUserTrades: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        activeTrades: [],
        finishedTrades: []
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserTrades(userId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.trades) {
            if (!this.props.trades || (this.props.trades !== nextProps.trades)) {
                let trades = nextProps.trades.map(trade => new TradeModel(trade, this.props.user));
                let activeTrades = trades.filter(trade => !trade.isFinished);
                let finishedTrades = trades.filter(trade => trade.isFinished);
                this.setState({ activeTrades: activeTrades, finishedTrades: finishedTrades });
            }
        } else {
            this.setState({ activeTrades: [], finishedTrades: [] });
        }
    }

    showTradeDetails = (theTrade) => {
        this.props.history.push(`/trade/show/${theTrade._id}`);
    };

    createTradeAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    buildActionList = () => {
        return [
            this.createTradeAction("Ansehen", <RemoveRedEye/>, this.showTradeDetails, false, false, true)
        ];
    };

    render() {
        const { loading } = this.props;

        return (
            <div>
                <ApplicationBar subtitle="Meine Tauschgeschäfte verwalten"/>
                <TradeGridList trades={this.state.activeTrades} loading={loading} actions={this.buildActionList()}  />
                <TradeGridList trades={this.state.finishedTrades} loading={loading} actions={this.buildActionList()} />
            </div>
        );
    }
}
