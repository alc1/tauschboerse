import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';

import ArticleChooser from '../ArticleChooser/ArticleChooser';
import ArticleRowList from '../ArticleRowList/ArticleRowList';

import './ChosenArticles.css';

const toolbarTitleStyles = { color: 'black' };

export default class ChosenArticles extends React.Component {

    static propTypes = {
        chosenArticles: PropTypes.array.isRequired,
        allArticles: PropTypes.array.isRequired,
        canEdit: PropTypes.bool.isRequired,
        isEditing: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        startEditing: PropTypes.func,
        cancelEditing: PropTypes.func,
        saveChanges: PropTypes.func,
        toggleArticle: PropTypes.func
    };

    static defaultProps = {
        canEdit: false,
        isEditing: false,
        loading: false,
        allArticles: []
    }

    isArticleSelected = (article) => {
        return this.props.chosenArticles.some(a => a._id === article._id);
    };

    edit = () => {
        if (typeof this.props.startEditing === 'function') {
            this.props.startEditing();
        }
    }

    save = () => {
        if (typeof this.props.saveChanges === 'function') {
            this.props.saveChanges();
        }
    }

    cancel = () => {
        if (typeof this.props.cancelEditing === 'function') {
            this.props.cancelEditing();
        }
    }
        
    generateToolbarButton(label, icon, clickHandler, key) {
        return <FlatButton label={label} icon={icon} onClick={clickHandler} disabled={this.props.loading} key={key} primary />;
    }

    generateToolbarButtonsForShow() {
        return [
            this.generateToolbarButton('Bearbeiten', <EditIcon/>, this.edit, 'edit')
        ];
    }

    generateToolbarButtonsForEdit() {
        return [
            this.generateToolbarButton('Speichern', <SaveIcon/>, this.save, 'save'),
            this.generateToolbarButton('Abbrechen', <CancelIcon/>, this.cancel, 'cancel')
        ];
    }

    generateArticleChooser() {
        return this.props.isEditing ? <ArticleChooser articles={this.props.allArticles} chosenArticles={this.props.chosenArticles} toggleArticle={this.props.toggleArticle} /> : null;
    }

    render() {
        const toolbarButtons = this.props.canEdit ? (this.props.isEditing ? this.generateToolbarButtonsForEdit() : this.generateToolbarButtonsForShow()) : [];

        return (
            <div className="chosen-articles__container">
                <Paper className="chosen-articles__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text={this.props.title}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            {toolbarButtons}
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="chosen-articles__articles-container">
                        <ArticleRowList articles={this.props.chosenArticles} isEditing={this.props.isEditing} isArticleSelected={this.isArticleSelected} toggleArticle={this.props.toggleArticle} />
                        {this.generateArticleChooser()}
                    </div>
                </Paper>
            </div>
        );
    }
}
