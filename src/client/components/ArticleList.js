import React from 'react';
import PropTypes from 'prop-types';

import './ArticleList.css';

export default class ArticleList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
    };

    generateArticleList() {
        let rows = this.props.articles.map(article => <tr><td>{article.title}</td><td>{article.description}</td></tr>);
        return (
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    hasArticles() {
        return this.props.articles ? this.props.articles.length > 0 : false;
    }

    render() {
        let articleList = this.hasArticles() ? this.generateArticleList() : <div>keine Artikel</div>;
        return (
            <div className="article-list">
                {articleList}
            </div>
        );
    }
}
