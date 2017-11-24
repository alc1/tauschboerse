import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import ArticleGridList from '../components/ArticleGridList';

import { setLoading } from '../actions/application';
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
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    showArticleDetails = (theArticleId) => {
        this.props.history.push(`/article/${theArticleId}`);
    };

    editArticleDetails = (theArticleId, theUserId) => {
        this.props.history.push(`/user/${theUserId}/article/${theArticleId}`);
    };

    createNewArticle = (theUserId) => {
        this.props.history.push(`/user/${theUserId}/article`);
    };

    deleteArticle = (theArticleId, theUserId) => {
        this.props.setLoading(true);
        this.props.deleteArticle(theUserId, theArticleId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    };

    createArticleAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    createArticleActions = () => {
        let articleActions = [];
        articleActions.push(this.createArticleAction("Ansehen", <RemoveRedEye/>, this.showArticleDetails, true, false, true));
        articleActions.push(this.createArticleAction("Bearbeiten", <Edit/>, this.editArticleDetails, false, false, true));
        articleActions.push(this.createArticleAction("Löschen", <Delete/>, this.deleteArticle, false, true, false));
        return articleActions
    };

    render() {
        const { user, articles } = this.props;
        return (
            <div>
                <ApplicationBar/>
                <ArticleGridList articles={articles} articleActions={this.createArticleActions()}/>
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

export default connect(mapStateToProps, { loadUserArticles, deleteArticle, setLoading })(UserArticlesPage);
