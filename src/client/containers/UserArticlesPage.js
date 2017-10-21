import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';

import LoadingIndicatorComponent from "../components/LoadingIndicatorComponent";
import ArticleComponent from '../components/ArticleComponent';
import { loadUserArticles } from '../actions/user';
import { getUserArticles } from '../selectors/user';

class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        loading: false
    };

    componentDidMount() {
        this.setState({ loading: true });
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then((res) => this.setState({ loading: false }))
            .catch((err) => this.setState({ loading: false }));
    }

    showArticleDetails = (theArticleId) => {
        this.props.history.push(`/article/${theArticleId}`);
    };

    render() {
        const { loading } = this.state;
        const { articles } = this.props;
        const articleComponents = articles.map(article => {
            let actions = [];
            actions.push(<FlatButton key={actions.length} label="Detail" onClick={this.showArticleDetails.bind(this, article._id)} primary/>);
            return <ArticleComponent key={article._id} article={article} actions={actions}/>;
        });
        return (
            <div>
                <LoadingIndicatorComponent loading={loading}/>
                <div className="articles-list">
                    {articleComponents}
                </div>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles })(UserArticlesPage);
