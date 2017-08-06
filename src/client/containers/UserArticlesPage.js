import React from 'react';
import { Link } from 'react-router-dom';

import ArticleComponent from '../components/ArticleComponent';
import DataService from '../services/DataService';

class UserArticlesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: []
        };
    }

    componentDidMount() {
        const { userId } = this.props.match.params;
        const dataService = new DataService();
        const loadRequest = dataService.loadUserArticles(userId);
        loadRequest.done((data) => {
            this.setState({
                articles: data.articles
            });
        });
    }

    render() {
        const articleComponents = this.state.articles.map(article =>
            <div key={article._id}>
                <ArticleComponent id={article._id} title={article.title} description={article.description}/>
                <Link to={`/article/${article._id}`}>Detail</Link>
            </div>
        );
        return (
            <div>
                {articleComponents}
            </div>
        );
    }
}

export default UserArticlesPage;
