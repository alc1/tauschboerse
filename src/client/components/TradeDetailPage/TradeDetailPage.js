import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeDetail from '../TradeDetail/TradeDetail';
import TradeModel from '../../model/TradeModel';
import TradeAction from '../../constants/TradeAction';

export default class TradeDetailPage extends React.Component {

    state = {
        trade: null
    };

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        loadTrade: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { tradeId } = this.props.match.params;
        this.props.loadTrade(tradeId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.trade && (!this.props.trade || (this.props.trade !== nextProps.trade))) {
            this.setState({ trade: new TradeModel(nextProps.trade, this.props.user) });
        } else {
            this.setState({ trades: null });
        }
    }

    doTradeAction = (theAction) => {
        switch(theAction) {
            case TradeAction.TRADE_ACTION_ACCEPT:
                this.props.acceptTrade(this.props.trade);
                break;
            case TradeAction.TRADE_ACTION_DECLINE:
                this.props.declineTrade(this.props.trade);
                break;
            case TradeAction.TRADE_ACTION_MAKE_COUNTEROFFER:
                break;
            case TradeAction.TRADE_ACTION_SUBMIT:
                this.props.submitTrade(this.props.trade);
                break;
            case TradeAction.TRADE_ACTION_WITHDRAW:
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <div>
                <ApplicationBar/>
                {this.state.trade && <TradeDetail trade={this.state.trade} user={this.props.user} onAction={this.doTradeAction} />}
            </div>
        );
    }
}
