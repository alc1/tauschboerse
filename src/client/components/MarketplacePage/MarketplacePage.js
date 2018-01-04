import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { Step, Stepper, StepButton, StepContent, StepLabel } from 'material-ui/Stepper';

import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import SectionClosedIcon from 'material-ui/svg-icons/av/play-circle-filled';
import SectionOpenedIcon from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import ApplicationBar from '../../containers/ApplicationBar';
import ArticleGridList from '../ArticleGridList/ArticleGridList';
import ArticleSearchInput from '../ArticleSearchInput/ArticleSearchInput';

export default class MarketplacePage extends React.Component {

    constructor(props) {
        super(props);
        this.newSearch = false;
        this.currentSearch = '';
    }

    static propTypes = {
        lastSearch: PropTypes.object,
        user: PropTypes.object,
        trade: PropTypes.object,
        sectionIndex: PropTypes.number.isRequired,
        findArticles: PropTypes.func.isRequired,
        clearLastSearch: PropTypes.func.isRequired,
        createTrade: PropTypes.func.isRequired,
        openSection: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        muiTheme: PropTypes.shape({
            palette: PropTypes.shape({
                primary1Color: PropTypes.string.isRequired,
            }).isRequired
        }).isRequired
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
                    this.openFirstSectionIfNeeded();
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
                    userArticles = nextProps.lastSearch.articles.filter(article => article.owner._id === this.props.user._id);
                    notUserArticles = nextProps.lastSearch.articles.filter(article => article.owner._id !== this.props.user._id);
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
            this.props.history.push(`/trade/show/${nextProps.trade._id}`);
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
        this.props.history.push(`/article/${theArticle._id}`);
    };

    createArticleAction = (label, icon, onClick, isPrimary, isSecondary, isRaised) => {
        return { label, icon, onClick, isPrimary, isSecondary, isRaised };
    };

    buildActionList = (forUserArticles) => {
        return forUserArticles ? [
            this.createArticleAction("Bearbeiten", <EditIcon/>, this.showArticleDetails, true, false, true)
        ] : this.props.user ? [
            this.createArticleAction("Ansehen", <ShowIcon/>, this.showArticleDetails, true, false, true),
            this.createArticleAction("Tauschen", <SwapIcon/>, this.startTrade, false, true, true)
        ] : [
            this.createArticleAction("Ansehen", <ShowIcon/>, this.showArticleDetails, true, false, true)
        ];
    };

    openFirstSectionIfNeeded = () => {
        if (this.props.sectionIndex === -1) {
            this.onSectionClicked(0);
        }
    };

    onSectionClicked = (theSectionIndex) => {
        this.props.openSection(theSectionIndex === this.props.sectionIndex ? -1 : theSectionIndex);
    };

    createFirstSectionText = (theNumberOfResults) => {
        if (theNumberOfResults === 1) {
            return `${theNumberOfResults} Artikel entspricht den Suchkriterien`;
        }
        return `${theNumberOfResults} Artikel entsprechen den Suchkriterien`;
    };

    createSecondSectionText = (theNumberOfResults) => {
        if (theNumberOfResults === 1) {
            return `${theNumberOfResults} eigener Artikel entspricht den Suchkriterien`;
        }
        return `${theNumberOfResults} eigene Artikel entsprechen den Suchkriterien`;
    };

    render() {
        const { loading, muiTheme, sectionIndex } = this.props;
        const { searchText, notUserArticles, userArticles } = this.state;

        return (
            <div>
                <ApplicationBar subtitle="Auf dem Marktplatz"/>
                <ArticleSearchInput text={searchText} onSearch={this.onSearch}/>
                <Stepper
                    activeStep={sectionIndex}
                    linear={false}
                    orientation="vertical">
                    <Step>
                        <StepButton icon={sectionIndex === 0 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClicked.bind(this, 0)}>
                            <StepLabel>{this.createFirstSectionText(notUserArticles.length)}</StepLabel>
                        </StepButton>
                        <StepContent transitionDuration={0}>
                            <ArticleGridList articles={notUserArticles} articleActions={this.buildActionList(false)} loading={loading}/>
                        </StepContent>
                    </Step>
                    {this.props.user &&
                        <Step>
                            <StepButton icon={sectionIndex === 1 ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClicked.bind(this, 1)}>
                                <StepLabel>{this.createSecondSectionText(userArticles.length)}</StepLabel>
                            </StepButton>
                            <StepContent transitionDuration={0}>
                                <ArticleGridList articles={userArticles} articleActions={this.buildActionList(true)} loading={loading}/>
                            </StepContent>
                        </Step>
                    }
                </Stepper>
            </div>
        );
    }
}
