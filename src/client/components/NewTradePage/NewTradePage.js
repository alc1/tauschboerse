import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import TradeEditor from '../TradeEditor/TradeEditor';

import './NewTradePage.css';

export default class NewTradePage extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        initTradeEditor: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        loadNewTrade: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        partnerArticlesInfo: PropTypes.object,
        saveTrade: PropTypes.func.isRequired,
        setFilterText: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        setPageNum: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        stepIndex: PropTypes.number.isRequired,
        toggleArticle: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        userArticlesInfo: PropTypes.object
    };

    static defaultProps = {
        stepIndex: 0
    }

    componentDidMount() {
        this.props.setLoading(true);
        this.props.initTradeEditor();

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

    handleSave = () => {
        this.props.saveTrade()
            .then(() => {
                this.props.history.push(`/trade/show/${this.props.trade._id}`);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleCancel = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div>
                <ApplicationBar subtitle="Neues Tauschgeschäft erstellen" />
                <div className="base-page">
                    {this.props.trade &&
                        <TradeEditor
                            onSave={this.handleSave}
                            onCancel={this.handleCancel}
                            partnerArticlesInfo={this.props.partnerArticlesInfo}
                            setFilterText={this.props.setFilterText}
                            setPageNum={this.props.setPageNum}
                            setStepIndex={this.props.setStepIndex}
                            stepIndex={this.props.stepIndex}
                            toggleArticle={this.props.toggleArticle}
                            trade={this.props.trade}
                            user={this.props.user}
                            userArticlesInfo={this.props.userArticlesInfo}
                        />
                    }
                </div>
            </div>
        );
    }
}
