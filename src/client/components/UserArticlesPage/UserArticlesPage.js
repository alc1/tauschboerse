import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SearchBar from 'material-ui-search-bar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import PlusIcon from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../../containers/ApplicationBar';
import ArticleGridList from '../ArticleGridList/ArticleGridList';
import PageButton from '../PageButton/PageButton';

import ArticleStatus from '../../../shared/constants/ArticleStatus';

import './UserArticlesPage.css';

const statusRadioButtonStyle = { maxWidth: '20vw' };

export default class UserArticlesPage extends React.Component {

    static propTypes = {
        filteredArticles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadArticle: PropTypes.func.isRequired,
        deleteArticle: PropTypes.func.isRequired,
        filterUserArticles: PropTypes.func.isRequired,
        userArticlesFilter: PropTypes.shape({
            filterText: PropTypes.string,
            filterStatus: PropTypes.string
        }).isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        filteredArticles: [],
        isDeleteDialogOpen: false,
        articleToDelete: null,
        deleteDialogContext: null
    };

    componentDidMount() {
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId);
        this.filterFieldTimeout = setTimeout(() => this.filterField.focus(), 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.filterFieldTimeout);
    }

    editArticleDetails = (theArticle) => {
        this.props.history.push(`/article/${theArticle._id}`);
    };

    createNewArticle = () => {
        this.props.history.push('/article');
    };

    showDeleteConfirmationDialog = (theArticle) => {
        this.props.loadArticle(theArticle._id)
            .then(response => {
                let deleteDialogContent;
                if (response.article.trades && response.article.trades.count > 0) {
                    deleteDialogContent = (
                        <div>
                            <div>{`Der Artikel "${response.article.title}" ist/war in Tauschgeschäfte verwickelt und kann deswegen nur als gelöscht markiert werden. Dabei werden die noch aktiven Tauschgeschäfte storniert.`}</div>
                            <br/>
                            <span>{'Willst Du den Artikel wirklich als gelöscht markieren?'}</span>
                        </div>
                    );
                }
                else {
                    deleteDialogContent = (
                        <div>
                            {`Willst Du den Artikel "${response.article.title}" wirklich komplett löschen?`}
                        </div>
                    );
                }
                this.setState({
                    isDeleteDialogOpen: true,
                    articleToDelete: theArticle,
                    deleteDialogContext: deleteDialogContent
                });
            });
    };

    closeDeleteDialog = () => {
        this.setState({
            isDeleteDialogOpen: false,
            articleToDelete: null,
            deleteDialogContext: null
        });
    };

    deleteArticle = (theArticle) => {
        this.closeDeleteDialog();
        this.props.deleteArticle(theArticle.owner._id, theArticle._id);
    };

    createArticleAction = (label, icon, onClick, isPrimary, isSecondary, isRaised, isDisabled) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised, isDisabled };
    };

    isDeleteDisabled = (theArticle) => {
        return theArticle.status === ArticleStatus.STATUS_DEALED || theArticle.status === ArticleStatus.STATUS_DELETED;
    };

    createArticleActions = () => {
        return [
            this.createArticleAction("Bearbeiten", <EditIcon/>, this.editArticleDetails, true, false, true),
            this.createArticleAction("Löschen", <DeleteIcon/>, this.showDeleteConfirmationDialog, false, true, false, this.isDeleteDisabled)
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
        const { loading, filteredArticles, userArticlesFilter } = this.props;
        const { isDeleteDialogOpen, articleToDelete, deleteDialogContext } = this.state;
        return (
            <div>
                <ApplicationBar subtitle="Meine Artikel verwalten"/>
                <div className="user-articles-page__filter-container">
                    <SearchBar
                        ref={element => this.filterField = element}
                        hintText="Nach Titel / Beschreibung / Kategorie filtern ..."
                        onChange={this.onFilterTextChange}
                        onRequestSearch={this.onFilterRequested}
                        value={userArticlesFilter.filterText}
                        disabled={loading}/>
                    <Paper>
                        <RadioButtonGroup
                            className="user-articles-page__status-container"
                            name="status"
                            valueSelected={userArticlesFilter.filterStatus}
                            onChange={this.onFilterStatusChange}>
                            <RadioButton style={statusRadioButtonStyle} disabled={loading} value={''} label="Alle Artikel"/>
                            <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_FREE} label="Freie Artikel"/>
                            <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALING} label="Artikel in Verhandlung"/>
                            <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALED} label="Getauschte Artikel"/>
                            <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DELETED} label="Gelöschte Artikel"/>
                        </RadioButtonGroup>
                    </Paper>
                </div>
                <ArticleGridList articles={filteredArticles} articleActions={this.createArticleActions()} loading={loading}/>
                <PageButton onClick={this.createNewArticle}>
                    <PlusIcon/>
                </PageButton>
                <Dialog
                    open={isDeleteDialogOpen}
                    title="Löschen?"
                    modal={true}
                    actions={[
                        <RaisedButton label="Löschen" icon={<DeleteIcon/>} onClick={this.deleteArticle.bind(this, articleToDelete)} keyboardFocused secondary/>,
                        <RaisedButton label="Abbrechen" onClick={this.closeDeleteDialog}/>
                    ]}>
                    {deleteDialogContext}
                </Dialog>
            </div>
        );
    }
}
