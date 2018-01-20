import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from 'material-ui-search-bar';

export default class ArticleSearchInput extends React.Component {

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

    componentWillReceiveProps(nextProps) {
        this.setState({ text: nextProps.text });
    }

    onChange = (text) => {
        this.setState({ text: text });
    };

    onSearch = () => {
        this.props.onSearch(this.state.text);
    };

    render() {
        return (
            <SearchBar
                ref={element => this.searchField = element}
                hintText="Nach Titel / Beschreibung / Kategorie suchen ..."
                onChange={this.onChange}
                onRequestSearch={this.onSearch}
                value={this.state.text}
            />
        );
    }
}