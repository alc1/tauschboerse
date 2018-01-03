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
        saveArticles: PropTypes.func.isRequired,
        startEditingUserArticles: PropTypes.func.isRequired,
        startEditingPartnerArticles: PropTypes.func.isRequired,
        cancelEditingUserArticles: PropTypes.func.isRequired,
        cancelEditingPartnerArticles: PropTypes.func.isRequired,
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

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft verwalten"/>
                {this.props.trade && <TradeDetail {...this.props} />}
            </div>
        );
    }
}
