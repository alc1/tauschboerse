import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import Swap from '../_svg/Swap';
import ArticleList from '../ArticleList/ArticleList';

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

    render() {
        const { trade, loading, actions } = this.props;
        return (
            <Paper className="trade-summary">
                <div className="trade-summary__trade-container">
                    <div className="trade-summary__articles-container">
                        <span className="trade-summary__articles-title">{trade.userArticlesListTitle()}</span>
                        <ArticleList articles={trade.currentOffer.userArticles} loading={loading} hideCheckbox hideDescription hideOwner hideCreationDate hideStatus/>
                    </div>
                    <div className="trade-summary__swap-image-wrapper">
                        <Paper zDepth={2} circle>
                            <Swap className="trade-summary__swap-image"/>
                        </Paper>
                    </div>
                    <div className="trade-summary__articles-container">
                        <span className="trade-summary__articles-title">{trade.partnerArticlesListTitle()}</span>
                        <ArticleList articles={trade.currentOffer.tradePartnerArticles} loading={loading} hideCheckbox hideDescription hideOwner hideCreationDate hideStatus/>
                    </div>
                </div>
                <div className="trade-summary__button-bar">
                    {actions}
                </div>
            </Paper>
        );
    }
}
