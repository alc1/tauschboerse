import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';

import ArticleChooser from '../ArticleChooser/ArticleChooser';
import ArticleList from '../ArticleList/ArticleList';

import './ChosenArticles.css';

const toolbarTitleStyles = { color: 'black' };

export default class ChosenArticles extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        canEdit: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        onAction: PropTypes.func,
        title: PropTypes.string.isRequired,
        user: PropTypes.object
    };

    static defaultProps = {
        canEdit: false,
        loading: false,
    }

    state = {
        isEditing: false,
        newlyChosenArticles: null
    };

    stopEditing() {
        this.setState({
            isEditing: false,
            newlyChosenArticles: null
        });
    }

    onArticleToggled = (article) => {
        
    };

    edit = () => {
        this.setState({
            isEditing: true,
            newlyChosenArticles: this.props.articles.slice()
        });
    }

    save = () => {
        this.props.onAction('SAVE', this.state.newlyChosenArticles);
        this.stopEditing();
    }

    cancel = () => {
        this.stopEditing();
    }
        
    generateToolbarButton(label, icon, clickHandler) {
        return <FlatButton label={label} icon={icon} onClick={clickHandler} disabled={this.props.loading} primary />;
    }

    generateToolbarButtonsForShow() {
        return [
            this.generateToolbarButton('Bearbeiten', <EditIcon/>, this.edit)
        ];
    }

    generateToolbarButtonsForEdit() {
        return [
            this.generateToolbarButton('Speichern', <SaveIcon/>, this.save),
            this.generateToolbarButton('Abbrechen', <CancelIcon/>, this.cancel)
        ];
    }

    generateArticleList() {
        return <ArticleList articles={this.props.articles} />;
    }

    generateArticleChooser() {
        return <ArticleChooser articles={this.state.newlyChosenArticles} user={this.props.user} onArticleToggled={this.onArticleToggled} />
    }

    render() {
        const toolbarButtons = this.props.canEdit ? (this.state.isEditing ? this.generateToolbarButtonsForEdit() : this.generateToolbarButtonsForShow()) : [];
        const content = this.state.isEditing ? this.generateArticleChooser() : this.generateArticleList();

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
                        {content}
                    </div>
                </Paper>
            </div>
        );
    }
}
