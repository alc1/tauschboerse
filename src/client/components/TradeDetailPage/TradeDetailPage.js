import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeDetail from '../TradeDetail/TradeDetail';
import TradeModel from '../../model/TradeModel';
import TradeAction from '../../constants/TradeAction';

export default class TradeDetailPage extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadTrade: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        submitTrade: PropTypes.func.isRequired,
        acceptTrade: PropTypes.func.isRequired,
        declineTrade: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { tradeId } = this.props.match.params;
        this.props.loadTrade(tradeId, this.props.user)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft verwalten"/>
                {this.props.trade && <TradeDetail {...this.props} />}
            </div>
        );
    }
}
