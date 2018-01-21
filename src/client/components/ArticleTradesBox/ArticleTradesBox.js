import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import TradeLink from '../../containers/TradeLink';

import './ArticleTradesBox.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleTradesBox extends React.Component {

    static propTypes = {
        trades: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired
    };

    render() {
        const { trades, loading } = this.props;
        const tradesLinks = trades.allTrades.sort((trade1, trade2) => - moment(trade1.trade.createDate).format('YYYYMMDDHHmmss').localeCompare(moment(trade2.trade.createDate).format('YYYYMMDDHHmmss')))
            .map(trade => <TradeLink key={trade._id} trade={trade} loading={loading}/>);

        return (
            <section className="article-trades">
                <Paper>
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Involviert in:"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div>
                        {tradesLinks}
                    </div>
                </Paper>
            </section>
        );
    }
}
