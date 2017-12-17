import React from 'react';
import PropTypes from 'prop-types';

import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';

import './ChosenArticles.css';

const toolbarTitleStyles = { color: 'black' };

export default class ChosenArticles extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        isEditing: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        onAction: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired
    };

    static defaultProps = {
        isEditing: false,
        loading: false,
    }

    onArticleToggled = (article) => {
        
    };

    edit = () => {
        this.props.onAction('START_EDIT');
    }

    save = () => {
        this.props.onAction('SAVE');
    }

    cancel = () => {
        this.props.onAction('CANCEL');
    }
        
    generateToolbarButton(label, icon, clickHandler) {
        return <FlatButton label={label} icon={icon} onClick={clickHandler} disabled={loading} primary />;
    }

    generateToolbarButtonsForShow() {
        return [
            this.generateToolbarButton('Bearbeiten', <EditIcon/>, edit)
        ];
    }

    generateToolbarButtonsForEdit() {
        return [
            this.generateToolbarButton('Speichern', <SaveIcon/>, save),
            this.generateToolbarButton('Abbrechen', <CancelIcon/>, cancel)
        ];
    }

    generateArticleList() {
        return <ArticleList articles={this.props.articles} />;
    }

    generateArticleChooser() {
        return <ArticleChooser articles={this.props.articles} userId={this.props.userId} onArticleToggled={onArticleToggled} />
    }

    render() {
        const toolbarButtons = this.props.isEditing ? this.generateToolbarButtonsForEdit() : this.generateToolbarButtonsForShow();
        const content = this.props.isEditing ? this.generateArticleChooser() : this.generateArticleList();

        return (
            <div className="articlelist__container">
                <Paper className="articlelist__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text="{this.props.title}}"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            {toolbarButtons}
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="articlelist__articles-container">
                        {content}
                    </div>
                </Paper>
            </div>
        );
    }
}
