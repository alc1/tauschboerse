import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ListIcon from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import { cyan500, blue500, orange900, deepOrangeA700 } from 'material-ui/styles/colors';

import ArticleStatus from '../../shared/businessobjects/ArticleStatus';
import TradeState from '../../shared/businessobjects/TradeState';

import './Dashboard.css';

const buttonStyle = { margin: '10px' };
const toolbarStyle = { width: '100%' };
const toolbarTitleStyle = { color: 'black' };

class Dashboard extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        trades: PropTypes.array.isRequired,
        history: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
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

    render() {
        const { user, articles, trades } = this.props;
        const { fontFamily } = this.props.muiTheme;

        const countArticlesFree = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_FREE ? sum + 1 : sum, 0);
        const countArticlesInNegotiation = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALING ? sum + 1 : sum, 0);
        const countArticlesDealed = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALED ? sum + 1 : sum, 0);
        const countArticlesDeleted = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DELETED ? sum + 1 : sum, 0);
        const countArticlesAll = countArticlesFree + countArticlesInNegotiation + countArticlesDealed + countArticlesDeleted;

        const countTradesInit = trades.reduce((sum, trade) => trade.state === TradeState.TRADE_STATE_INIT ? sum + 1 : sum, 0);
        const countTradesInNegotiation = trades.reduce((sum, trade) => trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION ? sum + 1 : sum, 0);
        const countTradesCompleted = trades.reduce((sum, trade) => trade.state === TradeState.TRADE_STATE_COMPLETED ? sum + 1 : sum, 0);
        const countTradesCanceled = trades.reduce((sum, trade) => trade.state === TradeState.TRADE_STATE_CANCELED ? sum + 1 : sum, 0);
        const countTradesAll = countTradesInit + countTradesInNegotiation + countTradesCompleted + countTradesCanceled;

        let articlesData = [
            { name: 'Keine Artikel vorhanden', value: 1 },
        ];
        if (countArticlesAll > 0) {
            articlesData = [
                {name: 'Frei', value: countArticlesFree, fill: cyan500},
                {name: 'In Verhandlung', value: countArticlesInNegotiation, fill: blue500},
                {name: 'Bereits gehandelt', value: countArticlesDealed, fill: orange900},
                {name: 'Gelöscht', value: countArticlesDeleted, fill: deepOrangeA700}
            ];
        }

        let tradesData = [
            { name: 'Keine Tauschgeschäfte vorhanden', value: 1 },
        ];
        if (countTradesAll > 0) {
            tradesData = [
                { name: 'In Vorbereitung', value: countTradesInit, fill: cyan500 },
                { name: 'In Verhandlung', value: countTradesInNegotiation, fill: blue500 },
                { name: 'Erfolgreich abgeschlossen', value: countTradesCompleted, fill: orange900 },
                { name: 'Abgebrochen', value: countTradesCanceled, fill: deepOrangeA700 }
            ];
        }

        return (
            <div className="dashboard__container">
                <span className="dashboard__text" style={{ fontFamily: fontFamily }}>Hallo {user.name}</span>
                <RaisedButton style={buttonStyle} label="Marktplatz durchstöbern" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')} primary/>
                <RaisedButton style={buttonStyle} label="Abmelden" icon={<ExitIcon/>} onClick={this.props.logout} secondary/>
                <div className="dashboard__charts-container">
                    <div className="dashboard__charts-paper-container">
                        <Paper className="dashboard__charts-paper">
                            <Toolbar style={toolbarStyle}>
                                <ToolbarGroup>
                                    <ToolbarTitle style={toolbarTitleStyle} text={`Meine Artikel (${countArticlesAll})`}/>
                                </ToolbarGroup>
                                <ToolbarGroup>
                                    <RaisedButton style={buttonStyle} label="Artikel anzeigen" icon={<ListIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>
                                </ToolbarGroup>
                            </Toolbar>
                            <PieChart width={450} height={400}>
                                <Pie isAnimationActive={false} dataKey="value" data={articlesData} innerRadius={20} outerRadius={120} label={countArticlesAll > 0}/>
                                {countArticlesAll > 0 && <Tooltip/>}
                                <Legend/>
                            </PieChart>
                        </Paper>
                    </div>
                    <div className="dashboard__charts-paper-container">
                        <Paper className="dashboard__charts-paper">
                            <Toolbar style={toolbarStyle}>
                                <ToolbarGroup>
                                    <ToolbarTitle style={toolbarTitleStyle} text={`Tauschgeschäfte (${countTradesAll})`}/>
                                </ToolbarGroup>
                                <ToolbarGroup>
                                    <RaisedButton style={buttonStyle} label="Tauschgeschäfte anzeigen" icon={<SwapIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/trades`)} primary/>
                                </ToolbarGroup>
                            </Toolbar>
                            <PieChart width={450} height={400}>
                                <Pie isAnimationActive={false} dataKey="value" data={tradesData} innerRadius={20} outerRadius={120} label={countTradesAll > 0}/>
                                {countTradesAll > 0 && <Tooltip/>}
                                <Legend/>
                            </PieChart>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

export default muiThemeable()(Dashboard);
