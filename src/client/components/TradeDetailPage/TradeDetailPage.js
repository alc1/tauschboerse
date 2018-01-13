import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeDetail from '../TradeDetail/TradeDetail';

export default class TradeDetailPage extends React.Component {
    constructor(props) {
        super(props);

        this.intervalId = null;
    }

    static propTypes = {
        acceptTrade: PropTypes.func.isRequired,
        checkForUpdatedTrade: PropTypes.func,
        declineTrade: PropTypes.func.isRequired,
        deleteTrade: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadTrade: PropTypes.func.isRequired,
        newVersionAvailable: PropTypes.bool.isRequired,
        setDelivered: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        submitTrade: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        withdrawTrade: PropTypes.func.isRequired
    };

    static defaultProps = {
        loading: false,
        newVersionAvailable: false
    }

    componentDidMount() {
        const { tradeId } = this.props.match.params;
        this.loadTrade(tradeId);
    }

    componentWillUnmount() {
        this.stopIntervalTimer();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newVersionAvailable) {
            this.stopIntervalTimer();
        }
    }

    loadTrade(tradeId) {
        this.stopIntervalTimer();
        this.props.loadTrade(tradeId)
            .then(() => {
                // start an interval timer to check for changes in the displayed trade if required
                this.startIntervalTimer();
            });
    }

    startIntervalTimer() {
        if (typeof this.props.checkForUpdatedTrade === 'function') {
            if (this.props.trade.watchForUpdates) {
                this.intervalId = setInterval(() => { this.props.checkForUpdatedTrade(); }, 1000);
            }
        }
    }

    stopIntervalTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleAcceptTrade = () => {
        this.stopIntervalTimer();
        this.props.acceptTrade();
    }

    handleDeclineTrade = () => {
        this.stopIntervalTimer();
        this.props.declineTrade();
    }

    handleDeleteTrade = () => {
        this.stopIntervalTimer();
        this.props.deleteTrade()
            .then(() => {
                this.props.history.push('/');
            });
    }

    handleRefresh = () => {
        this.loadTrade(this.props.trade._id);
    }

    handleSetDelivered = () => {
        this.stopIntervalTimer();
        this.props.setDelivered();
    }

    handleSubmitTrade = () => {
        this.stopIntervalTimer();
        this.props.submitTrade();
    }

    handleWithdrawTrade = () => {
        this.stopIntervalTimer();
        this.props.withdrawTrade();
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft verwalten"/>
                {this.props.trade &&
                    <TradeDetail
                        history={this.props.history}
                        newVersionAvailable={this.props.newVersionAvailable}
                        onAcceptTrade={this.handleAcceptTrade}
                        onDeclineTrade={this.handleDeclineTrade}
                        onDeleteTrade={this.handleDeleteTrade}
                        onRefresh={this.handleRefresh}
                        onSetDelivered={this.handleSetDelivered}
                        onSubmitTrade={this.handleSubmitTrade}
                        onWithdrawTrade={this.handleWithdrawTrade}
                        trade={this.props.trade}
                        user={this.props.user}
                    />
                }
            </div>
        );
    }
}
