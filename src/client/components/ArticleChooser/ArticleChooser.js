import React from 'react';
import PropTypes from 'prop-types';

//import './ArticleChooser.css';

export default class ArticleChooser extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
    };

    static defaultProps = {
        articles: [],
    }

    generateArticleWrappers() {
        
    }

    hasArticles() {
        return this.props.articles ? this.props.articles.length > 0 : false;
    }
    
    render() {
        const hasArticles = this.props.articles.length > 0;
        const articleWrappers = hasArticles ? generateArticleWrappers() : null;

        return (
            <div></div>
        );
    }
}
