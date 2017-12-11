import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../containers/ApplicationBar';
import TradeDetail from '../components/TradeDetail';
import TradeModel from '../models/TradeModel';

import { loadTrade } from '../actions/trade';
import { setLoading } from '../actions/application';
import { getTrade } from '../selectors/trade';
import { getUser } from '../selectors/user';
import { isLoading } from '../selectors/application';

class TradeDetailPage extends React.Component {

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

    render() {
        let content = !this.props.trade ? <div></div> : <TradeDetail trade={this.state.trade} user={this.props.user} />;
        return (
            <div>
                <ApplicationBar/>
                {content}
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
