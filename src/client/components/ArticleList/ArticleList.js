import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from '../../containers/Placeholder';
import ArticleRow from '../ArticleRow/ArticleRow';

import './ArticleList.css';

export default class ArticleList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    };

    state = {
        selectedArticles: []
    };

    onSelectionToggled = (theArticle, isSelected) => {
        this.setState({
            selectedArticles: isSelected ? [...this.state.selectedArticles, theArticle] : this.state.selectedArticles.filter(article => article._id !== theArticle._id)
        });
    };

    generateArticleList = () => {
        return this.props.articles.map(article => {
            const isSelected = !!this.state.selectedArticles.find(selectedArticle => selectedArticle._id === article._id);
            return (
                <ArticleRow
                    key={article._id}
                    article={article}
                    onSelectionToggled={this.onSelectionToggled}
                    selectable={true}
                    selected={isSelected}/>
            );
        });
    };

    hasArticles() {
        return this.props.articles ? this.props.articles.length > 0 : false;
    }

    render() {
        const { loading } = this.props;
        let articleList = this.hasArticles() ? this.generateArticleList() : <Placeholder width={300} height={300} loading={loading} text="Keine Artikel gefunden" loadingText="... Artikel werden geladen ..."/>;
        return (
            <div className="article-list">
                {articleList}
            </div>
        );
    }
}
