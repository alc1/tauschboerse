import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from 'material-ui-search-bar';

export default class ArticleSearchInput extends React.Component {
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

    componentWillReceiveProps(nextProps) {
        this.setState({ text: nextProps.text });
    }
        
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