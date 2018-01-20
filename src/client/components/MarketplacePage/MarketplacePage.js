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
import ContentContainer from '../ContentContainer/ContentContainer';
import Placeholder from '../../containers/Placeholder';

import './MarketplacePage.css';

export default class MarketplacePage extends React.Component {

    constructor(props) {
        super(props);

        this.newSearch = false;
        this.currentSearch = '';
        this.pristine = true;
    }

    static propTypes = {
        clearLastSearch: PropTypes.func.isRequired,
        findArticles: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        marketplaceSectionIndex: PropTypes.number.isRequired,
        muiTheme: PropTypes.shape({
            palette: PropTypes.shape({
                primary1Color: PropTypes.string.isRequired,
            }).isRequired
        }).isRequired,
        openMarketplaceSection: PropTypes.func.isRequired,
        searchInfo: PropTypes.object,
        user: PropTypes.object
    };

    getSearchText(location) {
        let parsedQuery = queryString.parse(location.search);
        return parsedQuery.search || '';
    }

    findArticles(searchText) {
        if (this.currentSearch.length === 0) {
            this.currentSearch = searchText;
            this.setState({ searchText: searchText });
            this.props.findArticles(searchText)
                .then(() => {
                    this.currentSearch = '';
                    this.openFirstSectionIfNeeded();
                })
                .catch(() => {
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
        if (this.newSearch) {
            this.doSearch(nextProps.history.location);
            this.newSearch = false;
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
        this.props.history.push(`/trade/new/${theArticle._id}`);
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
        if (this.props.marketplaceSectionIndex === -1) {
            this.onSectionClick(0);
        }
    };

    onSectionClick = (theMarketplaceSectionIndex) => {
        this.props.openMarketplaceSection(theMarketplaceSectionIndex === this.props.marketplaceSectionIndex ? -1 : theMarketplaceSectionIndex);
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

    createMarketplaceSection = (theSectionIndex, theCurrentMarketplaceSectionIndex, theArticles, theSectionTitle, forUserArticles) => {
        const { loading, muiTheme } = this.props;
        return (
            <Step>
                <StepButton icon={theCurrentMarketplaceSectionIndex === theSectionIndex ? <SectionOpenedIcon color={muiTheme.palette.primary1Color}/> : <SectionClosedIcon/>} onClick={this.onSectionClick.bind(this, theSectionIndex)}>
                    <StepLabel>{theSectionTitle}</StepLabel>
                </StepButton>
                <StepContent transitionDuration={0}>
                    <ArticleGridList articles={theArticles} articleActions={this.buildActionList(forUserArticles)} loading={loading}/>
                </StepContent>
            </Step>
        );
    };

    render() {
        const { marketplaceSectionIndex, searchInfo } = this.props;
        const { hasSearched, text, articles, userArticles } = searchInfo;

        return (
            <div>
                <ApplicationBar subtitle="Auf dem Marktplatz"/>
                <section className="marketplace__search-container">
                    <ArticleSearchInput text={text} onSearch={this.onSearch}/>
                </section>
                {hasSearched ?
                    <Stepper
                        activeStep={marketplaceSectionIndex}
                        linear={false}
                        orientation="vertical">
                        {this.createMarketplaceSection(0, marketplaceSectionIndex, articles, this.createFirstSectionText(articles.length), false)}
                        {this.props.user && this.createMarketplaceSection(1, marketplaceSectionIndex, userArticles, this.createSecondSectionText(userArticles.length), true)}
                    </Stepper> :
                    <ContentContainer>
                        <Placeholder width={200} height={200} isVertical={true} text="Suche nach Artikeln, die Du gerne haben möchtest"/>
                    </ContentContainer>
                }
            </div>
        );
    }
}
