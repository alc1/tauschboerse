import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from "query-string";

import ApplicationBar from '../components/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';
import ArticleSearchInputComponent from '../components/ArticleSearchInputComponent';

import { findArticles, clearLastSearch } from '../actions/marketplace';
import { setLoading } from '../actions/application';
import { getLastSearch } from '../selectors/marketplace';
import { getUser } from '../selectors/user';
import { isLoading } from '../selectors/application';

class MarketplacePage extends React.Component {

    constructor(props) {
        super(props);
        this.newSearch = false;
        this.currentSearch = '';
    }

    static propTypes = {
        lastSearch: PropTypes.object,
        user: PropTypes.object.isRequired,
        findArticles: PropTypes.func.isRequired,
        clearLastSearch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        searchText: '',
        myArticles: [],
        notMyArticles: []
    };

    getSearchText(location) {
        let parsedQuery = queryString.parse(location.search);
        return parsedQuery.search || '';
    }

    findArticles(searchText) {
        if (this.currentSearch.length === 0) {
            this.currentSearch = searchText;
            this.setState({ searchText: searchText });
            this.props.setLoading(true);
            this.props.findArticles(searchText)
                .then(() => {
                    this.props.setLoading(false);
                    this.currentSearch = '';
                })
                .catch(() => {
                    this.props.setLoading(false);
                    this.currentSearch = '';
                });
        }
    }

    doSearch(location) {
        let searchText = this.getSearchText(location);
        if (searchText.length > 0) {
            this.findArticles(searchText, null);
        } else {
            this.setState({ searchText: '' });
            this.props.clearLastSearch();
        }
    }

    componentDidMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            if ((action === 'POP') && (this.props.history.location.pathname === location.pathname)) {
                this.doSearch(this.props.history.location);
            }
        });

        this.doSearch(this.props.history.location);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    componentWillReceiveProps(nextProps) {
        //
        if (this.newSearch) {
            this.doSearch(nextProps.history.location);
            this.newSearch = false;
        }

        //
        if (nextProps.lastSearch) {
            if ((!this.props.lastSearch) || (nextProps.lastSearch !== this.props.lastSearch)) {
                let myArticles, notMyArticles;
                if (this.props.user) {
                    myArticles = nextProps.lastSearch.articles.filter(a => a.owner._id === this.props.user._id);
                    notMyArticles = nextProps.lastSearch.articles.filter(a => a.owner._id !== this.props.user._id);
                } else {
                    myArticles = [];
                    notMyArticles = nextProps.lastSearch.articles;
                }
                this.setState({ myArticles: myArticles, notMyArticles: notMyArticles });
            }
        } else {
            this.setState({ myArticles: [], notMyArticles: [] });
        }
    }

    onSearch = (theSearchText) => {
        this.newSearch = true;
        if (theSearchText.length > 0) {
            this.props.history.push(`/marketplace?search=${theSearchText}`);
        } else {
            this.props.history.push(`/marketplace`);
        }
    };

    buildActionList = () => {
        return [];
    };

    render() {
        let articles = (this.props.lastSearch) ? this.props.lastSearch.articles : [];

        return (
            <div>
                <ApplicationBar/>
                <ArticleSearchInputComponent text={this.state.searchText} onSearch={this.onSearch} />
                <ArticleGridList articles={this.state.notMyArticles} articleActions={this.buildActionList(false)} loading={this.props.loading} />
                {(this.state.myArticles.length > 0) && <ArticleGridList articles={this.state.myArticles} articleActions={this.buildActionList(true)} loading={this.props.loading} />}
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

export default connect(mapStateToProps, { findArticles, clearLastSearch, setLoading })(MarketplacePage);
