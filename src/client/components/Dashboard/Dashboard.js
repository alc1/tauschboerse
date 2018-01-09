import React from 'react';
import PropTypes from 'prop-types';

import DashboardActions from '../../containers/DashboardActions';
import IncomingTrades from '../../containers/IncomingTrades';
import DashboardChart from '../DashboardChart/DashboardChart';

import ArticleStatus from '../../../shared/constants/ArticleStatus';
import TradeState from '../../../shared/constants/TradeState';
import TradesModel from '../../model/TradesModel';

import './Dashboard.css';

export default class Dashboard extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        trades: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadUserTrades: PropTypes.func.isRequired,
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    componentDidMount() {
        Promise.all([
            this.props.loadUserArticles(this.props.user._id),
            this.props.loadUserTrades(this.props.user._id)
        ]);
    }

    render() {
        const { user, articles, loading } = this.props;
        const { fontFamily } = this.props.muiTheme;
        const trades = new TradesModel(this.props.trades, user);
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
            <div className="dashboard">
                <span className="dashboard__title" style={{ fontFamily: fontFamily }}>Hallo {user.name}</span>
                <DashboardActions/>
                <IncomingTrades trades={trades} loading={loading}/>
                <div className="dashboard__charts-container">
                    <DashboardChart title="Meine Artikel" data={articlesData} placeholderText="Keine Artikel gefunden" placeholderLoadingText="... Artikel werden geladen ..." loading={loading}/>
                    <DashboardChart title="Meine Tauschgeschäfte" data={tradesData} placeholderText="Keine Tauschgeschäfte gefunden" placeholderLoadingText="... Tauschgeschäfte werden geladen ..." loading={loading}/>
                </div>
            </div>
        );
    }
}
