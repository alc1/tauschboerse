import React from 'react';
import PropTypes from 'prop-types';

import ArticleRow from '../ArticleRow/ArticleRow';

import './ArticleRowList.css';

export default class ArticleRowList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        isEditing: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
        onToggleArticle: PropTypes.func
    };

    handleSelectionToggled = (article, isChecked) => {
        if (typeof this.props.onToggleArticle === 'function') {
            this.props.onToggleArticle(article);
        }
    }

    render() {
        let articleRows = this.props.articles.map(article => <ArticleRow key={article._id} article={article} selectable={true} selected={this.props.selected} hideCheckbox={!this.props.isEditing} onSelectionToggled={this.handleSelectionToggled}/>);

        return (
            <div className="article-row-list_container">
                {articleRows}
            </div>
        );
    }
}
