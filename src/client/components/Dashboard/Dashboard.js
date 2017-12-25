import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import { cyan500, blue500, orange900, deepOrangeA700 } from 'material-ui/styles/colors';

import PlusIcon from 'material-ui/svg-icons/content/add';
import ArticlesIcon from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';

import Placeholder from '../../containers/Placeholder';
import TradesList from '../TradesList/TradesList';

import ArticleStatus from '../../../shared/constants/ArticleStatus';
import TradesModel from '../../model/TradesModel';

import './Dashboard.css';

const buttonStyle = { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' };
const toolbarStyle = { width: '100%' };
const toolbarTitleStyle = { color: 'black' };

export default class Dashboard extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        trades: PropTypes.array.isRequired,
        history: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        setLoading: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadUserTrades: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        Promise.all([
            this.props.loadUserArticles(this.props.user._id),
            this.props.loadUserTrades(this.props.user._id)
        ])
        .then(() => this.props.setLoading(false))
        .catch(() => this.props.setLoading(false));
    }

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    showTrade = (theTrade) => {
        this.goTo(`/trade/${theTrade._id}`);
    };

    createTradeAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    createTradeActions = () => {
        return [
            this.createTradeAction("Angebot ansehen", <ShowIcon/>, this.showTrade, true, false, true)
        ];
    };

    render() {
        const { user, articles, loading } = this.props;
        const { fontFamily } = this.props.muiTheme;
        const trades = new TradesModel(this.props.trades, user);
        const countIncomingRequests = trades.receivedTrades.length;
        const countArticlesFree = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_FREE ? sum + 1 : sum, 0);
        const countArticlesInNegotiation = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALING ? sum + 1 : sum, 0);
        const countArticlesDealed = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALED ? sum + 1 : sum, 0);
        const countArticlesDeleted = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DELETED ? sum + 1 : sum, 0);
        const countArticlesAll = countArticlesFree + countArticlesInNegotiation + countArticlesDealed + countArticlesDeleted;

        const articlesData = [
            { name: 'Frei', value: countArticlesFree, fill: cyan500 },
            { name: 'In Verhandlung', value: countArticlesInNegotiation, fill: blue500 },
            { name: 'Bereits gehandelt', value: countArticlesDealed, fill: orange900 },
            { name: 'Gelöscht', value: countArticlesDeleted, fill: deepOrangeA700 }
        ];
        const tradesData = [
            { name: 'In Vorbereitung', value: trades.newTrades.length, fill: cyan500 },
            { name: 'In Verhandlung', value: trades.openTrades.length, fill: blue500 },
            { name: 'Erfolgreich abgeschlossen', value: trades.completedTrades.length, fill: orange900 },
            { name: 'Abgebrochen', value: trades.canceledTrades.length, fill: deepOrangeA700 }
        ];

        return (
            <div className="dashboard__container">
                <span className="dashboard__text" style={{ fontFamily: fontFamily }}>Hallo {user.name}</span>
                <div className="dashboard__options-bar">
                    <Paper className="dashboard__option-box">
                        <h2 className="dashboard__subtitle">Marktplatz</h2>
                        <span className="dashboard__option-text">Durchstöbere den Marktplatz und finde, was Du schon immer gesucht hast.</span>
                        <RaisedButton style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                    </Paper>
                    <Paper className="dashboard__option-box">
                        <h2 className="dashboard__subtitle">Tauschgeschäfte</h2>
                        <span className="dashboard__option-text">Verwalte hier deine Tauschgeschäfte.</span>
                        <RaisedButton style={buttonStyle} label="Meine Tauschgeschäfte" icon={<SwapIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/trades`)} primary/>
                    </Paper>
                    <Paper className="dashboard__option-box">
                        <h2 className="dashboard__subtitle">Artikel</h2>
                        <span className="dashboard__option-text">Verwalte hier deine Artikel.</span>
                        <RaisedButton style={buttonStyle} label="Neuer Artikel erfassen" icon={<PlusIcon/>} onClick={this.goTo.bind(this, '/article')}/>
                        <RaisedButton style={buttonStyle} label="Meine Artikel" icon={<ArticlesIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>
                    </Paper>
                    <Paper className="dashboard__option-box">
                        <h2 className="dashboard__subtitle">Benutzerkonto</h2>
                        <span className="dashboard__option-text">Verwalte hier dein Benutzerkonto.</span>
                        <RaisedButton style={buttonStyle} label="Mein Konto" icon={<AccountIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/details`)} primary/>
                        <RaisedButton data-button-id="logout" style={buttonStyle}  label="Abmelden" icon={<ExitIcon/>} onClick={this.props.logout} secondary/>
                    </Paper>
                </div>
                <Paper className="dashboard__news">
                    <Toolbar style={toolbarStyle}>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text={countIncomingRequests > 0 ? 'Du hast eingehende Tauschanfragen' : 'Eingehende Tauschanfragen'}/>
                        </ToolbarGroup>
                    </Toolbar>
                    {countIncomingRequests > 0 ? (
                        <TradesList trades={trades.receivedTrades} loading={loading} tradeActions={this.createTradeActions()}/>
                    ) : (
                        <Placeholder width={100} height={100} loading={loading} text="Keine eingehenden Tauschanfragen" loadingText="... Tauschgeschäfte werden geladen ..."/>
                    )}
                </Paper>
                <div className="dashboard__charts-container">
                    <Paper className="dashboard__chart-box">
                        <Toolbar style={toolbarStyle}>
                            <ToolbarGroup>
                                <ToolbarTitle style={toolbarTitleStyle} text={`Meine Artikel (${countArticlesAll})`}/>
                            </ToolbarGroup>
                        </Toolbar>
                        {countArticlesAll > 0 ? (
                            <PieChart width={450} height={400}>
                                <Pie dataKey="value" data={articlesData} innerRadius={20} outerRadius={120} isAnimationActive label/>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        ) : (
                            <Placeholder width={450} height={343} loading={loading} text="Keine Artikel gefunden" loadingText="... Artikel werden geladen ..."/>
                        )}
                    </Paper>
                    <Paper className="dashboard__chart-box">
                        <Toolbar style={toolbarStyle}>
                            <ToolbarGroup>
                                <ToolbarTitle style={toolbarTitleStyle} text={`Tauschgeschäfte (${trades.count})`}/>
                            </ToolbarGroup>
                        </Toolbar>
                        {trades.count > 0 ? (
                            <PieChart width={450} height={400}>
                                <Pie dataKey="value" data={tradesData} innerRadius={20} outerRadius={120} isAnimationActive label/>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        ) : (
                            <Placeholder width={450} height={343} loading={loading} text="Keine Tauschgeschäfte gefunden" loadingText="... Tauschgeschäfte werden geladen ..."/>
                        )}
                    </Paper>
                </div>
            </div>
        );
    }
}
