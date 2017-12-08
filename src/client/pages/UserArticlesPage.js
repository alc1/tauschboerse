import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import PlusIcon from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../containers/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';
import DeleteArticleDialog from '../components/DeleteArticleDialog';

import { setLoading } from '../actions/application';
import { loadUserArticles } from '../actions/user';
import { deleteArticle } from '../actions/article';
import { isLoading } from '../selectors/application';
import { getUserArticles, getUser } from '../selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';

class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        deleteArticle: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        isDeleteDialogOpen: false,
        articleToDelete: null
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    editArticleDetails = (theArticle) => {
        this.props.history.push(`/article/${theArticle._id}`);
    };

    createNewArticle = () => {
        this.props.history.push('/article');
    };

    showDeleteConfirmationDialog = (theArticle) => {
        this.setState({
            isDeleteDialogOpen: true,
            articleToDelete: theArticle
        });
    };

    closeDeleteDialog = () => {
        this.setState({
            isDeleteDialogOpen: false,
            articleToDelete: null
        });
    };

    deleteArticle = (theArticle) => {
        this.closeDeleteDialog();
        this.props.setLoading(true);
        this.props.deleteArticle(theArticle.owner._id, theArticle._id)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    };

    createArticleAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    createArticleActions = () => {
        return [
            this.createArticleAction("Bearbeiten", <EditIcon/>, this.editArticleDetails, true, false, true),
            this.createArticleAction("Löschen", <DeleteIcon/>, this.showDeleteConfirmationDialog, false, true, false)
        ];
    };

    render() {
        const { articles, loading } = this.props;
        const { isDeleteDialogOpen, articleToDelete } = this.state;
        const articleTitle = articleToDelete ? articleToDelete.title : '';
        return (
            <div>
                <ApplicationBar/>
                <ArticleGridList articles={articles} articleActions={this.createArticleActions()} loading={loading}/>
                <FloatingActionButton style={FLOATING_ACTION_BUTTON_POSITION_STYLE} onClick={this.createNewArticle}>
                    <PlusIcon/>
                </FloatingActionButton>
                <DeleteArticleDialog
                    open={isDeleteDialogOpen}
                    deleteAction={this.deleteArticle.bind(this, articleToDelete)}
                    cancelAction={this.closeDeleteDialog}
                    articleTitle={articleTitle}/>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles, deleteArticle, setLoading })(UserArticlesPage);
