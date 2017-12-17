import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SearchBar from 'material-ui-search-bar';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import PlusIcon from 'material-ui/svg-icons/content/add';

import ApplicationBar from '../containers/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';
import DeleteArticleDialog from '../components/DeleteArticleDialog';

import { setLoading } from '../store/actions/application';
import { loadUserArticles } from '../store/actions/user';
import { deleteArticle } from '../store/actions/article';
import { isLoading } from '../store/selectors/application';
import { getUserArticles, getUser } from '../store/selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';
import './UserArticlesPage.css';

const ArticleStatus = require('../../shared/businessobjects/ArticleStatus');
const statusRadioButtonStyle = { maxWidth: '20vw' };

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
        articles: [],
        isDeleteDialogOpen: false,
        articleToDelete: null,
        editingFilterText: '',
        appliedFilterText: '',
        appliedFilterStatus: ''
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then(() => {
                this.applyFilterFromUrl();
                this.props.setLoading(false);
            })
            .catch(() => this.props.setLoading(false));
        setTimeout(() => this.filterField.focus(), 500);
    }

    componentWillReceiveProps(nextProps) {
        this.applyFilterFromUrl();
        setTimeout(() => this.filterField.focus(), 500);
    }

    applyFilterFromUrl = () => {
        let parsedQuery = queryString.parse(this.props.history.location.search);
        const filter = parsedQuery.filter || '';
        const status = parsedQuery.status || '';
        this.setState({
            editingFilterText: filter,
            appliedFilterText: filter,
            appliedFilterStatus: status,
            articles: this.filterArticles(this.props.articles, filter, status)
        });
    };

    filterArticles = (theArticles, theFilterText, theFilterStatus) => {
        return theArticles.filter(article =>
            (article.title.includes(theFilterText) || article.description.includes(theFilterText)) &&
            (theFilterStatus === '' || article.status === theFilterStatus));
    };

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
        this.setState({
            editingFilterText: theFilterText
        });
    };

    onFilterStatusChange = (theEvent, theFilterStatus) => {
        this.onApplyFilter(this.state.editingFilterText, theFilterStatus);
    };

    onApplyFilter = (theText, theStatus) => {
        let urlPath = `/user/${this.props.user._id}/articles`;
        let urlParams = '';
        urlParams = this.appendQueryParameter(urlParams, 'filter', theText);
        urlParams = this.appendQueryParameter(urlParams, 'status', theStatus);
        this.props.history.replace(urlPath + urlParams);
    };

    appendQueryParameter = (theUrlParams, theParameterName, theParameterValue) => {
        if (theParameterValue && theParameterValue.length > 0) {
            if (theUrlParams.length > 0) {
                theUrlParams = theUrlParams + '&';
            }
            else {
                theUrlParams = theUrlParams + '?';
            }
            theUrlParams = theUrlParams + `${theParameterName}=${theParameterValue}`;
        }
        return theUrlParams;
    };

    onFilterRequested = () => {
        this.onApplyFilter(this.state.editingFilterText, this.state.appliedFilterStatus);
    };

    render() {
        const { loading } = this.props;
        const { articles, isDeleteDialogOpen, articleToDelete, editingFilterText, appliedFilterStatus } = this.state;
        const articleTitle = articleToDelete ? articleToDelete.title : '';
        return (
            <div>
                <ApplicationBar/>
                <SearchBar
                    ref={element => this.filterField = element}
                    hintText="Filtern nach Titel/Beschreibung"
                    onChange={this.onFilterTextChange}
                    onRequestSearch={this.onFilterRequested}
                    value={editingFilterText}
                    disabled={loading}
                />
                <Paper>
                    <RadioButtonGroup
                        className="user-articles-page__status-container"
                        name="status"
                        valueSelected={appliedFilterStatus}
                        onChange={this.onFilterStatusChange}>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={''} label="Alle Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_FREE} label="Freie Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALING} label="Artikel in Verhandlung"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DEALED} label="Bereits gehandelte Artikel"/>
                        <RadioButton style={statusRadioButtonStyle} disabled={loading} value={ArticleStatus.STATUS_DELETED} label="Gelöschte Artikel"/>
                    </RadioButtonGroup>
                </Paper>
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
