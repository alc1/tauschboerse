import React from 'react';
import PropTypes from 'prop-types';

import ArticleFieldsBox from '../ArticleFieldsBox/ArticleFieldsBox';
import ArticleTradesBox from '../ArticleTradesBox/ArticleTradesBox';

import './ArticleDetails.css';

export default class ArticleDetails extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        article: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            categories: PropTypes.array.isRequired,
            status: PropTypes.string,
            created: PropTypes.string,
            owner: PropTypes.object,
            trades: PropTypes.object
        }).isRequired,
        loading: PropTypes.bool.isRequired,
        errors: PropTypes.object,
        onChange: PropTypes.func,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    render() {
        const { isDisplayMode, article, errors, loading, onChange, onAddCategory, onRemoveCategory } = this.props;
        const hasTrades = article.trades && article.trades.allTrades.length > 0;
        return (
            <div className="article-details">
                <ArticleFieldsBox
                    isDisplayMode={isDisplayMode}
                    article={article}
                    loading={loading}
                    errors={errors}
                    onChange={onChange}
                    onAddCategory={onAddCategory}
                    onRemoveCategory={onRemoveCategory}/>
                {hasTrades &&
                    <ArticleTradesBox trades={article.trades} loading={loading}/>
                }
            </div>
        );
    }
}
