import React from 'react';

import ArticleComponent from '../components/ArticleComponent';
import DataService from '../services/DataService';

class ArticleDetailPage extends React.Component {

    constructor() {
        super();
        this.state = {
            article: undefined
        };
    }

    componentDidMount() {
        const { articleId } = this.props.match.params;
        const dataService = new DataService();
        const loadRequest = dataService.loadArticle(articleId);
        loadRequest.done((data) => {
            this.setState({
                article: data.article
            });
        });
    }

    render() {
        const { article } = this.state;
        return (
            <div>
                {article && <ArticleComponent id={article._id} title={article.title} description={article.description}/>}
            </div>
        );
    }
}

export default ArticleDetailPage;
