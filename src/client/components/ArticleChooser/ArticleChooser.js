import React from 'react';
import PropTypes from 'prop-types';

import ArticleRowList from '../ArticleRowList/ArticleRowList';
import ArticleSearchInput from '../ArticleSearchInput/ArticleSearchInput';

import './ArticleChooser.css';

export default class ArticleChooser extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        setLoading: PropTypes.func.isRequired
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
    
    render() {
        return (
            <div className="article-chooser_container">
                <ArticleSearchInput text={this.state.searchText} onSearch={this.onSearch} />
                <ArticleRowList articles={this.props.articles} isEditing={this.state.isEditing} />
            </div>
        );
    }
}
