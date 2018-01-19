import React from 'react';
import PropTypes from 'prop-types';

import ArticleRow from '../ArticleRow/ArticleRow';
import Placeholder from '../../containers/Placeholder';

import './ArticleRowList.css';

export default class ArticleRowList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        emptyText: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
        onToggleArticle: PropTypes.func,
        withArticleLink: PropTypes.bool.isRequired
    };

    static defaultProps = {
        withArticleLink: false
    };

    handleSelectionToggled = (article, isChecked) => {
        if (typeof this.props.onToggleArticle === 'function') {
            this.props.onToggleArticle(article);
        }
    };

    renderEmptyList() {
        return (
            <Placeholder width={100} height={100} text={this.props.emptyText} isVertical={false} />
        )
    }

    renderArticleRowList() {
        let articleRows = this.props.articles.map(article => <ArticleRow key={article._id} article={article} selectable={true} selected={this.props.selected} hideCheckbox={!this.props.isEditing} onSelectionToggled={this.handleSelectionToggled} withArticleLink={this.props.withArticleLink}/>);

        return (
            <div className="article-row-list_container">
                {articleRows}
            </div>
        );
    }

    render() {
        return (this.props.articles.length > 0) ? this.renderArticleRowList() : this.renderEmptyList();
    }
}
