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
        userArticles: PropTypes.object,
        partnerArticles: PropTypes.object,
        loadTrade: PropTypes.func.isRequired,
        startEditingUserArticles: PropTypes.func.isRequired,
        startEditingPartnerArticles: PropTypes.func.isRequired,
        cancelEditingUserArticles: PropTypes.func.isRequired,
        cancelEditingPartnerArticles: PropTypes.func.isRequired,
        saveUserArticles: PropTypes.func.isRequired,
        savePartnerArticles: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
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
            case TradeAction.TRADE_ACTION_LOAD_USER_ARTICLES:
                this.props.loadUserArticles(this.props.user._id);
                break;
            case TradeAction.TRADE_ACTION_LOAD_PARTNER_ARTICLES:
                this.props.loadPartnerArticles(this.props.trade.tradePartner._id);
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft verwalten"/>
                {this.props.trade && <TradeDetail {...this.props} />}
            </div>
        );
    }
}
