import React from 'react';
import PropTypes from 'prop-types';

import ArticleRowList from '../ArticleRowList/ArticleRowList';
import ArticleSearchInput from '../ArticleSearchInput/ArticleSearchInput';

import './ArticleChooser.css';

export default class ArticleChooser extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        chosenArticles: PropTypes.array.isRequired,
        toggleArticle: PropTypes.func.isRequired
    };

    state = {
        searchText: ''
    }

    componentDidMount() {
        this.props.setLoading(true);
        this.props.loadUserArticles(this.props.user._id)
            .then(() => {
                this.props.setLoading(false);
            })
            .catch(() => this.props.setLoading(false));
//        setTimeout(() => this.filterField.focus(), 500);
    }

    onSearch = (theSearchText) => {
    };

    // generateArticleWrappers() {
        
    // }

    selectionToggled = (e) => {
        if (typeof this.props.toggleArticle === 'function') {
            this.props.toggleArticle(e);
        }
    };
    
    isArticleSelected = (article) => {
        return this.props.chosenArticles.some(a => a._id === article._id);
    };

    render() {
        return (
            <div className="article-chooser_container">
                <ArticleSearchInput text={this.state.searchText} onSearch={this.onSearch} />
                <ArticleRowList articles={this.props.articles} isEditing={true} selected={this.isArticleSelected} toggleArticle={this.props.toggleArticle} />
            </div>
        );
    }
}
