import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeEditor from '../TradeEditor/TradeEditor';

import './EditTradePage.css';

export default class EditTradePage extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        stepIndex: PropTypes.number.isRequired,
        userArticles: PropTypes.array,
        partnerArticles: PropTypes.array,
        chosenUserArticles: PropTypes.array,
        chosenPartnerArticles: PropTypes.array,
        loadTrade: PropTypes.func.isRequired,
        saveArticles: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        stepIndex: 0,
    }

    handleSave = () => {

    };

    componentDidMount() {
        this.props.setLoading(true);

        const { tradeId } = this.props.match.params;

        var loadPromises = [
            this.props.loadTrade(tradeId, this.props.user),
            this.props.loadUserArticles(this.props.user._id)
        ];
        Promise.all(loadPromises)
            .then(() => this.props.loadPartnerArticles(this.props.trade.tradePartner._id))
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft bearbeiten" />
                <div className="base-page">
                    {this.props.trade && <TradeEditor {...this.props} save={this.handleSave} />}
                </div>
            </div>
        );
    }
}
