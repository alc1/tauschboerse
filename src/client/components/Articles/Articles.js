import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import SearchBar from 'material-ui-search-bar';

import ArticleRowList from '../ArticleRowList/ArticleRowList';
import ArticleSearchInput from '../ArticleSearchInput/ArticleSearchInput';

import './Articles.css';

const toolbarTitleStyles = { color: 'black' };

export default class Articles extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        filtering: PropTypes.bool.isRequired,
        filterText: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onFilterChange: PropTypes.func,
        pageSize: PropTypes.number.isRequired,
        selected: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        onToggleArticle: PropTypes.func
    };

    static defaultProps = {
        filtering: false,
        isEditing: false,
        filterText: '',
        pageSize: 20,
        selected: false
    }

    handleToggleArticle = (article) => {
        if (typeof this.props.onToggleArticle === 'function') {
            this.props.onToggleArticle(article);
        }
    };

    handleFilterChange = (theText) => {
        if (typeof this.props.onFilterChange === 'function') {
            this.props.onFilterChange(theText);
        }
    }

    handleRequestSearch = (theText) => {

    }

    render() {
        let articles = this.props.articles;

        return (
            <div className="articles__container">
                <Paper className="articles__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text={this.props.title}/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="articles__articles-container">
                        {this.props.filtering && <SearchBar ref={element => this.filterField = element}
                            hintText="Nach Titel / Beschreibung / Kategorie filtern ..."
                            onChange={this.handleFilterChange}
                            onRequestSearch={this.handleRequestSearch}
                            value={this.props.filterText} />}
                        <ArticleRowList articles={articles} isEditing={this.props.isEditing} selected={this.props.selected} onToggleArticle={this.handleToggleArticle} />
                    </div>
                </Paper>
            </div>
        );
    }
}
