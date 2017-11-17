import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import ArticleComponent from '../components/ArticleComponent';
import { loadUserArticles } from '../actions/user';
import { getUserArticles, getUser } from '../selectors/user';

class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
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

    editArticleDetails = (theUserId, theArticleId) => {
        this.props.history.push(`/user/${theUserId}/article/${theArticleId}`);
    };

    createNewArticle = (theUserId) => {
        this.props.history.push(`/user/${theUserId}/article`);
    };

    render() {
        const { loading } = this.state;
        const { user, articles } = this.props;
        const articleComponents = articles.map(article => {
            let actions = [];
            actions.push(<FlatButton key={actions.length} label="Detail" onClick={this.showArticleDetails.bind(this, article._id)} primary/>);
            actions.push(<FlatButton key={actions.length} label="Bearbeiten" onClick={this.editArticleDetails.bind(this, user._id, article._id)}/>);
            return <ArticleComponent key={article._id} article={article} actions={actions}/>;
        });
        const buttonPositionStyle = {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        };
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <div className="articles-list">
                    {articleComponents}
                </div>
                <FloatingActionButton style={buttonPositionStyle} onClick={this.createNewArticle.bind(this, user._id)}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        user: getUser(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles })(UserArticlesPage);
