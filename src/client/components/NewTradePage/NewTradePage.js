import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeEditor from '../TradeEditor/TradeEditor';

import './NewTradePage.css';

export default class NewTradePage extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        stepIndex: PropTypes.number.isRequired,
        userArticles: PropTypes.array,
        partnerArticles: PropTypes.array,
        chosenUserArticles: PropTypes.array,
        chosenPartnerArticles: PropTypes.array,
        loadNewTrade: PropTypes.func.isRequired,
        saveTrade: PropTypes.func.isRequired,
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
        stepIndex: 0
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

    componentDidMount() {
        this.props.setLoading(true);

        const { articleId } = this.props.match.params;

        var loadPromises = [
            this.props.loadNewTrade(articleId),
            this.props.loadUserArticles()
        ];
        Promise.all(loadPromises)
            .then(() => this.props.loadPartnerArticles())
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Neues Tauschgeschäft erstellen" />
                {this.props.trade && <TradeEditor {...this.props} onSave={this.handleSave} onCancel={this.handleCancel} />}
            </div>
        );
    }
}
