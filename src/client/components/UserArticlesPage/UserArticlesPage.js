import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SearchBar from 'material-ui-search-bar';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import PlusIcon from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../../containers/ApplicationBar';
import ArticleGridList from '../ArticleGridList/ArticleGridList';
import DeleteArticleDialog from '../DeleteArticleDialog/DeleteArticleDialog';
import PageButton from '../PageButton/PageButton';

import './UserArticlesPage.css';

const ArticleStatus = require('../../../shared/constants/ArticleStatus');
const statusRadioButtonStyle = { maxWidth: '20vw' };

export default class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        deleteArticle: PropTypes.func.isRequired,
        filterUserArticles: PropTypes.func.isRequired,
        userArticlesFilter: PropTypes.shape({
            filterText: PropTypes.string,
            filterStatus: PropTypes.string
        }).isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        articles: [],
        isDeleteDialogOpen: false,
        articleToDelete: null
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
        this.filterField.focus();
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

    onFilterTextChange = (theFilterText) => {
        this.props.filterUserArticles(theFilterText, this.props.userArticlesFilter.filterStatus);
    };

    onFilterStatusChange = (theEvent, theFilterStatus) => {
        this.props.filterUserArticles(this.props.userArticlesFilter.filterText, theFilterStatus);
    };

    onFilterRequested = () => {
        this.props.filterUserArticles(this.props.userArticlesFilter.filterText, this.props.userArticlesFilter.filterStatus);
    };

    render() {
        const { loading, articles, userArticlesFilter } = this.props;
        const { isDeleteDialogOpen, articleToDelete } = this.state;
        const articleTitle = articleToDelete ? articleToDelete.title : '';
        return (
            <div>
                <ApplicationBar/>
                <SearchBar
                    ref={element => this.filterField = element}
                    hintText="Nach Titel / Beschreibung filtern ..."
                    onChange={this.onFilterTextChange}
                    onRequestSearch={this.onFilterRequested}
                    value={userArticlesFilter.filterText}
                    disabled={loading}
                />
                <Paper>
                    <RadioButtonGroup
                        className="user-articles-page__status-container"
                        name="status"
                        valueSelected={userArticlesFilter.filterStatus}
                        onChange={this.onFilterStatusChange}>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={''} label="Alle Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_FREE} label="Freie Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALING} label="Artikel in Verhandlung"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALED} label="Bereits gehandelte Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DELETED} label="Gelöschte Artikel"/>
                    </RadioButtonGroup>
                </Paper>
                <ArticleGridList articles={articles} articleActions={this.createArticleActions()} loading={loading}/>
                <PageButton onClick={this.createNewArticle}>
                    <PlusIcon/>
                </PageButton>
                <DeleteArticleDialog
                    open={isDeleteDialogOpen}
                    deleteAction={this.deleteArticle.bind(this, articleToDelete)}
                    cancelAction={this.closeDeleteDialog}
                    articleTitle={articleTitle}/>
            </div>
        );
    }
}
