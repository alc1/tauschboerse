import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../components/ApplicationBar';
import TradesList from '../components/TradesList';

import { loadUserTrades } from '../actions/user';
import { setLoading } from '../actions/application';
import { getUser, getUserTrades } from '../selectors/user';
import { isLoading } from '../selectors/application';

class UserTradesPage extends React.Component {

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
        if (nextProps.trades && (!this.props.trades || (this.props.trades !== nextProps.trades))) {
            let activeTrades = nextProps.trades.filter(trade => !trade.isFinished);
            let finishedTrades = nextProps.trades.filter(trade => trade.isFinished);
            this.setState({ activeTrades: activeTrades, finishedTrades: finishedTrades });
        } else {
            this.setState({ activeTrades: [], finishedTrades: [] });
        }
    }

    render() {
        return (
            <div>
                <ApplicationBar/>
                <TradesList trades={this.state.activeTrades} />
                <TradesList trades={this.state.finishedTrades} />
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        trades: getUserTrades(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadUserTrades, setLoading })(UserTradesPage);
