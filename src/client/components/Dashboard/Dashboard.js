import React from 'react';
import PropTypes from 'prop-types';

import PageTitle from '../../containers/PageTitle';
import DashboardActions from '../../containers/DashboardActions';
import IncomingTrades from '../../containers/IncomingTrades';
import DashboardChart from '../DashboardChart/DashboardChart';
import ContentContainer from '../ContentContainer/ContentContainer';

import ArticleStatus from '../../../shared/constants/ArticleStatus';
import TradeState from '../../../shared/constants/TradeState';

import './Dashboard.css';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.watcherIntervalid = null;
    }

    static propTypes = {
        articles: PropTypes.array.isRequired,
        canReloadTrades: PropTypes.bool.isRequired,
        checkForNewTrades: PropTypes.func,
        loading: PropTypes.bool.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadUserTrades: PropTypes.func.isRequired,
        pollingInterval: PropTypes.number.isRequired,
        trades: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
    };

    componentDidMount() {
        Promise.all([
            this.props.loadUserArticles(),
            this.loadUserTrades()
        ]);
    }

    componentWillUnmount() {
        this.stopTradeWatcher();
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.canReloadTrades !== this.props.canReloadTrades) && newProps.canReloadTrades) {
            this.props.loadUserTrades();
        } else if (newProps.pollingInterval !== this.props.pollingInterval) {
            this.stopTradeWatcher();
            this.startTradeWatcher(newProps.pollingInterval);
        }
    }

    startTradeWatcher() {
        if (typeof this.props.checkForNewTrades === 'function') {
            this.watcherIntervalId = setInterval(this.checkIfNewTradesAvailable, this.props.pollingInterval);
        }
    }

    stopTradeWatcher() {
        if (this.watcherIntervalId) {
            clearInterval(this.watcherIntervalId);
            this.watcherIntervalId = null;
        }
    }

    checkIfNewTradesAvailable = () => {
        if (typeof this.props.checkForNewTrades === 'function') {
            this.props.checkForNewTrades();
        }
    };

    loadUserTrades() {
        this.stopTradeWatcher();
        return this.props.loadUserTrades()
            .then(() => { this.startTradeWatcher(this.props.pollingInterval); });
    }

    render() {
        const { user, articles, loading, trades } = this.props;
        const countArticlesFree = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_FREE ? sum + 1 : sum, 0);
        const countArticlesInNegotiation = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALING ? sum + 1 : sum, 0);
        const countArticlesDealed = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALED ? sum + 1 : sum, 0);
        const countArticlesDeleted = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DELETED ? sum + 1 : sum, 0);

        const articlesData = [
            { name: ArticleStatus.getShortDescription(ArticleStatus.STATUS_FREE), value: countArticlesFree, fill: ArticleStatus.getColor(ArticleStatus.STATUS_FREE) },
            { name: ArticleStatus.getShortDescription(ArticleStatus.STATUS_DEALING), value: countArticlesInNegotiation, fill: ArticleStatus.getColor(ArticleStatus.STATUS_DEALING) },
            { name: ArticleStatus.getShortDescription(ArticleStatus.STATUS_DEALED), value: countArticlesDealed, fill: ArticleStatus.getColor(ArticleStatus.STATUS_DEALED) },
            { name: ArticleStatus.getShortDescription(ArticleStatus.STATUS_DELETED), value: countArticlesDeleted, fill: ArticleStatus.getColor(ArticleStatus.STATUS_DELETED) }
        ];
        const tradesData = [
            { name: TradeState.getShortDescription(TradeState.TRADE_STATE_INIT), value: trades.newTrades.length, fill: TradeState.getColor(TradeState.TRADE_STATE_INIT) },
            { name: TradeState.getShortDescription(TradeState.TRADE_STATE_IN_NEGOTIATION), value: trades.openTrades.length, fill: TradeState.getColor(TradeState.TRADE_STATE_IN_NEGOTIATION) },
            { name: TradeState.getShortDescription(TradeState.TRADE_STATE_COMPLETED), value: trades.completedTrades.length, fill: TradeState.getColor(TradeState.TRADE_STATE_COMPLETED) },
            { name: TradeState.getShortDescription(TradeState.TRADE_STATE_CANCELED), value: trades.canceledTrades.length, fill: TradeState.getColor(TradeState.TRADE_STATE_CANCELED) }
        ];

        return (
            <ContentContainer>
                <PageTitle>{`Hallo ${user.name}`}</PageTitle>
                <DashboardActions/>
                <IncomingTrades trades={trades} loading={loading}/>
                <div className="dashboard__charts-container">
                    <DashboardChart title="Meine Artikel" data={articlesData} placeholderText="Keine Artikel gefunden" placeholderLoadingText="... Artikel werden geladen ..." loading={loading}/>
                    <DashboardChart title="Meine Tauschgeschäfte" data={tradesData} placeholderText="Keine Tauschgeschäfte gefunden" placeholderLoadingText="... Tauschgeschäfte werden geladen ..." loading={loading}/>
                </div>
            </ContentContainer>
        );
    }
}
