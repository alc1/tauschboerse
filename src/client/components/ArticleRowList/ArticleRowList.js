import React from 'react';
import PropTypes from 'prop-types';

import ArticleRow from '../ArticleRow/ArticleRow';

import './ArticleRowList.css';

export default class ArticleRowList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        isEditing: PropTypes.bool.isRequired
    };
    
    render() {
        let articleRows = this.props.articles.map(article => <ArticleRow key={article._id} article={article} isEditing={this.props.isEditing} onSelectionToggled={(article, isSelected) => console.log(`Selection of ${article.title} is now: ${isSelected}`)}/>);

        return (
            <div className="article-row-list_container">
                {articleRows}
            </div>
        );
    }
}
