import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import { cyan500, blue500, orange900, deepOrangeA700 } from 'material-ui/styles/colors';

import Placeholder from '../containers/Placeholder';
import Info from '../images/Info';

import ArticleStatus from '../../shared/businessobjects/ArticleStatus';
import TradeState from '../../shared/businessobjects/TradeState';
import TradesModel from '../models/TradesModel';

import './Dashboard.css';

const buttonStyle = { margin: '10px' };
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

    render() {
        const { user, articles, loading } = this.props;
        const { fontFamily } = this.props.muiTheme;
        const { accent1Color } = this.props.muiTheme.palette;

        const countIncomingRequests = 3; // TODO: Count incoming requests: trades.map(trade => new Trade(trade)).map(trade => trade.currentOffer).reduce((sum, offer) => offer.state === OfferState.OFFER_STATE_REQUESTED ? sum + 1 : sum, 0);// and sender is not current user

        const countArticlesFree = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_FREE ? sum + 1 : sum, 0);
        const countArticlesInNegotiation = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALING ? sum + 1 : sum, 0);
        const countArticlesDealed = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DEALED ? sum + 1 : sum, 0);
        const countArticlesDeleted = articles.reduce((sum, article) => article.status === ArticleStatus.STATUS_DELETED ? sum + 1 : sum, 0);
        const countArticlesAll = countArticlesFree + countArticlesInNegotiation + countArticlesDealed + countArticlesDeleted;

        let trades = new TradesModel(this.props.trades, user);

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
                {countIncomingRequests > 0 ? (
                    <span className="dashboard__text" style={{ fontFamily: fontFamily }}><Info width={25} height={25} fill={accent1Color}/>Hallo {user.name}, Du hast eingehende Tauschanfragen<Info width={25} height={25} fill={accent1Color}/></span>
                ) : (
                    <span className="dashboard__text" style={{ fontFamily: fontFamily }}>Hallo {user.name}</span>
                )}
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
                                    <RaisedButton style={buttonStyle} label="Anzeigen" icon={<ShowIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>
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
                    </div>
                    <div className="dashboard__charts-paper-container">
                        <Paper className="dashboard__charts-paper">
                            <Toolbar style={toolbarStyle}>
                                <ToolbarGroup>
                                    <ToolbarTitle style={toolbarTitleStyle} text={`Tauschgeschäfte (${trades.count})`}/>
                                </ToolbarGroup>
                                <ToolbarGroup>
                                    <RaisedButton style={buttonStyle} label="Anzeigen" icon={<ShowIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/trades`)} primary/>
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
            </div>
        );
    }
}
