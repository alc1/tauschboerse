import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import Swap from '../_svg/Swap';
import ArticleRowList from '../ArticleRowList/ArticleRowList';

import './TradeSummary.css';

export default class TradeSummary extends React.Component {

    static propTypes = {
        trade: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        actions: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: []
    };

    createArticleList = (theArticles) => {
        const { loading } = this.props;
        return (
            <ArticleRowList
                articles={theArticles}
                loading={loading}
                emptyText="Keine Artikel gefunden"
                hideCheckbox
                hideDescription
                hideOwner
                hideCreationDate
                hideStatus
                withArticleLink/>
        );
    };

    render() {
        const { trade, actions } = this.props;
        return (
            <Paper className="trade-summary">
                <div className="trade-summary__trade-container">
                    <div className="trade-summary__articles-container">
                        <span className="trade-summary__articles-title">{trade.userArticlesListTitle()}</span>
                        {this.createArticleList(trade.currentOffer.userArticles)}
                    </div>
                    <div className="trade-summary__swap-image-wrapper">
                        <Paper zDepth={2} circle>
                            <Swap className="trade-summary__swap-image"/>
                        </Paper>
                    </div>
                    <div className="trade-summary__articles-container">
                        <span className="trade-summary__articles-title">{trade.partnerArticlesListTitle()}</span>
                        {this.createArticleList(trade.currentOffer.tradePartnerArticles)}
                    </div>
                </div>
                <div className="trade-summary__button-bar">
                    {actions}
                </div>
            </Paper>
        );
    }
}
