import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import ArticleRowList from '../ArticleRowList/ArticleRowList';
import ArticleSearchInput from '../ArticleSearchInput/ArticleSearchInput';

import './Articles.css';

const toolbarTitleStyles = { color: 'black' };

export default class Articles extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        filtering: PropTypes.bool.isRequired,
        isEditing: PropTypes.bool.isRequired,
        pageSize: PropTypes.number.isRequired,
        selected: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        toggleArticle: PropTypes.func
    };

    static defaultProps = {
        filtering: false,
        isEditing: false,
        pageSize: 20,
        selected: false
    }

    state = {
        filterText: ''
    }

    onSearch = (text) => {

    }

    toggleArticle = (article) => {
        if (typeof this.props.toggleArticle === 'function') {
            this.props.toggleArticle(article);
        }
    };

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
                        {this.props.filtering && <ArticleSearchInput text={this.state.filterText} onSearch={this.onSearch} />}
                        <ArticleRowList articles={articles} isEditing={this.props.isEditing} selected={this.props.selected} toggleArticle={this.toggleArticle} />
                    </div>
                </Paper>
            </div>
        );
    }
}
