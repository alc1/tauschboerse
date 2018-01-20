import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import './ActionBox.css';

export default class ActionBox extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    };

    render() {
        const { title, text } = this.props;
        return (
            <section className="action-box">
                <Paper className="action-box__container">
                    <h2 className="action-box__title">{title}</h2>
                    <span className="action-box__text">{text}</span>
                    {this.props.children}
                </Paper>
            </section>
        );
    }
}
