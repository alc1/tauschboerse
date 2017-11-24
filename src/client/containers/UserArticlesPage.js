import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import ArticleComponent from '../components/ArticleComponent';

import { loadUserArticles } from '../actions/user';
import { deleteArticle } from '../actions/article';
import { getUserArticles, getUser } from '../selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';

class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        deleteArticle: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        loading: false
    };

    componentDidMount() {
        this.setState({ loading: true });
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ loading: false }));
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

    deleteArticle = (theUserId, theArticleId) => {
        this.setState({ loading: true });
        this.props.deleteArticle(theUserId, theArticleId)
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ loading: false }));
    };

    render() {
        const { loading } = this.state;
        const { user, articles } = this.props;
        const articleComponents = articles.map(article => {
            let actions = [];
            actions.push(<RaisedButton key={actions.length} icon={<RemoveRedEye/>} label="Ansehen" onClick={this.showArticleDetails.bind(this, article._id)} primary/>);
            actions.push(<RaisedButton key={actions.length} icon={<Edit/>} label="Bearbeiten" onClick={this.editArticleDetails.bind(this, user._id, article._id)}/>);
            actions.push(<FlatButton key={actions.length} icon={<Delete/>} label="Löschen" onClick={this.deleteArticle.bind(this, user._id, article._id)} secondary/>);
            return <ArticleComponent key={article._id} article={article} actions={actions}/>;
        });
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <div className="articles-list">
                    {articleComponents}
                </div>
                <FloatingActionButton style={FLOATING_ACTION_BUTTON_POSITION_STYLE} onClick={this.createNewArticle.bind(this, user._id)}>
                    <ContentAdd/>
                </FloatingActionButton>
                <GlobalMessageComponent/>
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

export default connect(mapStateToProps, { loadUserArticles, deleteArticle })(UserArticlesPage);
