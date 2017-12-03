import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../components/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';
import ArticleSearchInputComponent from '../components/ArticleSearchInputComponent';

import { findArticles } from '../actions/marketplace';
import { setLoading } from '../actions/application';
import { getLastSearch } from '../selectors/marketplace';
import { getUser } from '../selectors/user';
import { isLoading } from '../selectors/application';

class MarketplacePage extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        lastSearch: PropTypes.object,
        user: PropTypes.object.isRequired,
        findArticles: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        searchText: ''
    };

    componentDidMount() {
        if (this.props.lastSearch) {
            this.setState({ searchText: this.props.lastSearch.text });
            this.props.setLoading(true);
            this.props.findArticles(this.props.lastSearch.text, this.props.lastSearch.version)
                .then(() => this.props.setLoading(false))
                .catch(() => this.props.setLoading(false));
        }
    }

    onSearch = (theSearchText) => {
        this.props.setLoading(true);
        this.props.findArticles(theSearchText, null)
            .then(() => {
                this.props.setLoading(false);
            })
            .catch(() => {
                this.props.setLoading(false);
            });
    };

    render() {
        let articles = (this.props.lastSearch) ? this.props.lastSearch.articles : [];

        return (
            <div>
                <ApplicationBar/>
                <ArticleSearchInputComponent text={this.state.searchText} onSearch={this.onSearch} />
                <ArticleGridList articles={articles} loading={this.props.loading} />
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        lastSearch: getLastSearch(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { findArticles, setLoading })(MarketplacePage);
