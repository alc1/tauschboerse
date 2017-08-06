import React from 'react';

import ArticleComponent from '../components/ArticleComponent';
import DataService from '../services/DataService';

class ArticleDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            article: undefined
        };
    }

    componentDidMount() {
        const { articleId } = this.props.match.params;
        this.loadArticle(articleId);
    }

    componentWillReceiveProps(nextProps) {
        const { articleId } = nextProps.match.params;
        this.loadArticle(articleId);
    }

    loadArticle(theArticleId) {
        const dataService = new DataService();
        const loadRequest = dataService.loadArticle(theArticleId);
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
