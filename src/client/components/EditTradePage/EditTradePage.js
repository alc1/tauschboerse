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
        userArticleFilterText: PropTypes.string.isRequired,
        partnerArticleFilterText: PropTypes.string.isRequired,
        loadTrade: PropTypes.func.isRequired,
        saveTrade: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        setUserArticleFilterText: PropTypes.func.isRequired,
        setPartnerArticleFilterText: PropTypes.func.isRequired,
        initTradeEditor: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        stepIndex: 0,
        userArticleFilterText: '',
        partnerArticleFilterText: ''
    }

    componentDidMount() {
        this.props.setLoading(true);
        this.props.initTradeEditor();

        const { tradeId } = this.props.match.params;

        var loadPromises = [
            this.props.loadTrade(tradeId),
            this.props.loadUserArticles()
        ];
        Promise.all(loadPromises)
            .then(() => this.props.loadPartnerArticles())
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    handleSave = () => {
        this.props.setLoading(true);
        this.props.saveTrade()
            .then(() => {
                this.props.setLoading(false);
                this.props.history.push(`/trade/show/${this.props.trade._id}`);
            })
            .catch(() => {
                this.props.setLoading(false);
            });
    };

    handleCancel = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft bearbeiten" />
                <div className="base-page">
                    {this.props.trade && <TradeEditor {...this.props} onSave={this.handleSave} onCancel={this.handleCancel} />}
                </div>
            </div>
        );
    }
}
