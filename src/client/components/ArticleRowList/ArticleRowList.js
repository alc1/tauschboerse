import React from 'react';
import PropTypes from 'prop-types';

import ArticleRow from '../ArticleRow/ArticleRow';

import './ArticleRowList.css';

export default class ArticleRowList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        isEditing: PropTypes.bool.isRequired,
        isArticleSelected: PropTypes.func,
        toggleArticle: PropTypes.func
    };

    isArticleSelected = (article) => (typeof this.props.isArticleSelected === 'function') ? this.props.isArticleSelected(article) : false;

    selectionToggled = (article, isChecked) => {
        if (typeof this.props.toggleArticle === 'function') {
            this.props.toggleArticle(article);
        }
    }

    render() {
        let articleRows = this.props.articles.map(article => <ArticleRow key={article._id} article={article} selectable={true} selected={this.isArticleSelected(article)} hideCheckbox={!this.props.isEditing} onSelectionToggled={this.selectionToggled}/>);

        return (
            <div className="article-row-list_container">
                {articleRows}
            </div>
        );
    }
}
