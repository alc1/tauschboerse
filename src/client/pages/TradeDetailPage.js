import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../containers/ApplicationBar';
import TradeDetail from '../components/TradeDetail';

import { loadTrade } from '../actions/trade';
import { setLoading } from '../actions/application';
import { getTrade } from '../selectors/trade';
import { getUser } from '../selectors/user';
import { isLoading } from '../selectors/application';

class TradeDetailPage extends React.Component {

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

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.trades && (!this.props.trades || (this.props.trades !== nextProps.trades))) {
    //         let activeTrades = nextProps.trades.filter(trade => !trade.isFinished);
    //         let finishedTrades = nextProps.trades.filter(trade => trade.isFinished);
    //         this.setState({ activeTrades: activeTrades, finishedTrades: finishedTrades });
    //     } else {
    //         this.setState({ activeTrades: [], finishedTrades: [] });
    //     }
    // }

    render() {
        return (
            <div>
                <ApplicationBar/>
                <TradeDetail trade={this.props.trade} user={this.props.user} />
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        trade: getTrade(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadTrade, setLoading })(TradeDetailPage);
