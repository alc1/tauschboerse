import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from 'material-ui-search-bar';

import InputComponent from './InputComponent';

export default class ArticleSearchInputComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        text: PropTypes.string,
        onSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        text: ''
    };

    state = {
        text: this.props.text
    };

    onChange = (text) => {
        this.setState({
            text: text
        });
    };

    render() {
        return (
            <SearchBar
                onChange={this.onChange}
                onRequestSearch={() => {this.props.onSearch(this.state.text); }}
                value={this.state.text}
            />
        );
    }
}