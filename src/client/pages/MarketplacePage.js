import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from "query-string";
import axios from 'axios';

import { handleError } from '../actions/common';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Edit from 'material-ui/svg-icons/editor/mode-edit';

import ApplicationBar from '../containers/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';
import ArticleSearchInputComponent from '../components/ArticleSearchInputComponent';

import { findArticles, clearLastSearch, createTrade } from '../actions/marketplace';
import { setLoading } from '../actions/application';
import { getLastSearch, getTrade } from '../selectors/marketplace';
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
        trade: PropTypes.object,
        clearLastSearch: PropTypes.func.isRequired,
        createTrade: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        searchText: '',
        userArticles: [],
        notUserArticles: []
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
                let userArticles, notUserArticles;
                if (this.props.user) {
                    userArticles = nextProps.lastSearch.articles.filter(a => a.owner._id === this.props.user._id);
                    notUserArticles = nextProps.lastSearch.articles.filter(a => a.owner._id !== this.props.user._id);
                } else {
                    userArticles = [];
                    notUserArticles = nextProps.lastSearch.articles;
                }
                this.setState({ userArticles: userArticles, notUserArticles: notUserArticles });
            }
        } else {
            this.setState({ userArticles: [], notUserArticles: [] });
        }

        //
        if (nextProps.trade && (nextProps.trade !== this.props.trade)) {
            this.props.history.push(`/trade/${nextProps.trade._id}`);
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

    startTrade = (theArticle) => {
        this.props.createTrade(theArticle);
    };

    showArticleDetails = (theArticle) => {

    };

    createArticleAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    buildActionList = (forUserArticles) => {
        return forUserArticles ? [
            this.createArticleAction("Ansehen", <RemoveRedEye/>, this.showArticleDetails, false, false, true)
        ] : [
            this.createArticleAction("Tauschen", <Edit/>, this.startTrade, false, false, true)
        ];
    };

    render() {
        let articles = (this.props.lastSearch) ? this.props.lastSearch.articles : [];

        return (
            <div>
                <ApplicationBar/>
                <ArticleSearchInputComponent text={this.state.searchText} onSearch={this.onSearch} />
                <ArticleGridList articles={this.state.notUserArticles} articleActions={this.buildActionList(false)} loading={this.props.loading} />
                {(this.state.userArticles.length > 0) && <ArticleGridList articles={this.state.userArticles} articleActions={this.buildActionList(true)} loading={this.props.loading} />}
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        lastSearch: getLastSearch(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        trade: getTrade(theState)
    };
}

export default connect(mapStateToProps, { findArticles, clearLastSearch, createTrade, setLoading })(MarketplacePage);
