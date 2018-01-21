import React from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import SearchBar from 'material-ui-search-bar';
import UltimatePaginationMaterialUi from 'react-ultimate-pagination-material-ui';

import ArticleRowList from '../ArticleRowList/ArticleRowList';

import './Articles.css';

const toolbarTitleStyles = { color: 'black' };

export default class Articles extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        emptyText: PropTypes.string.isRequired,
        filtering: PropTypes.bool.isRequired,
        filterText: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onFilterChange: PropTypes.func,
        onPageChange: PropTypes.func,
        pageCount: PropTypes.number.isRequired,
        paging: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        selected: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        onToggleArticle: PropTypes.func,
        withArticleLink: PropTypes.bool.isRequired
    };

    static defaultProps = {
        emptyText: 'Keine Artikel vorhanden',
        filtering: false,
        filterText: '',
        isEditing: false,
        pageCount: 1,
        paging: false,
        pageNum: 1,
        selected: false,
        withArticleLink: false
    };

    handleToggleArticle = (article) => {
        if (typeof this.props.onToggleArticle === 'function') {
            this.props.onToggleArticle(article);
        }
    };

    handleFilterChange = (theText) => {
        if (typeof this.props.onFilterChange === 'function') {
            this.props.onFilterChange(theText);
        }
    };

    handleRequestSearch = (theText) => {
        // intentionally empty, not required as filtering takes place automatically on every key press
    };

    handlePageChange = (pageNum) => {
        if (typeof this.props.onPageChange === 'function') {
            this.props.onPageChange(pageNum);
        }
    };

    render() {
        let articles = this.props.articles;
        let paging = this.props.paging && (this.props.pageCount > 1);

        return (
            <section className="articles__container">
                <Paper className="articles__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text={this.props.title}/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="articles__articles-container">
                        {this.props.filtering &&
                            <div className="articles__filterContainer">
                                <SearchBar ref={element => this.filterField = element}
                                    hintText="Nach Titel / Beschreibung / Kategorie filtern ..."
                                    onChange={this.handleFilterChange}
                                    onRequestSearch={this.handleRequestSearch}
                                    value={this.props.filterText} />
                                <Divider />
                            </div>
                        }
                        <ArticleRowList articles={articles} emptyText={this.props.emptyText} isEditing={this.props.isEditing} selected={this.props.selected} onToggleArticle={this.handleToggleArticle} withArticleLink={this.props.withArticleLink}/>
                        {paging && <UltimatePaginationMaterialUi currentPage={this.props.pageNum} totalPages={this.props.pageCount} onChange={this.handlePageChange} />}
                    </div>
                </Paper>
            </section>
        );
    }
}
