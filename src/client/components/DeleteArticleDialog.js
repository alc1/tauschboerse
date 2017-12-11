import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import Delete from 'material-ui/svg-icons/action/delete';

export default class DeleteArticleDialog extends React.Component {

    static propTypes = {
        open: PropTypes.bool.isRequired,
        articleTitle: PropTypes.string.isRequired,
        deleteAction: PropTypes.func.isRequired,
        cancelAction: PropTypes.func.isRequired
    };

    render() {
        const { open, articleTitle, deleteAction, cancelAction } = this.props;
        const actions = [
            <RaisedButton label="Löschen" icon={<Delete/>} onClick={deleteAction} keyboardFocused secondary/>,
            <RaisedButton label="Abbrechen" onClick={cancelAction} primary/>
        ];
        return (
            <Dialog title="Löschen?" actions={actions} modal={true} open={open}>
                {`Willst Du den Artikel "${articleTitle}" wirklich löschen?`}
            </Dialog>
        );
    }
}
