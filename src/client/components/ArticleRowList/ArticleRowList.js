import React from 'react';
import PropTypes from 'prop-types';

import ArticleRow from '../ArticleRow/ArticleRow';
import Placeholder from '../../containers/Placeholder';

import './ArticleRowList.css';

export default class ArticleRowList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        emptyText: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
        onToggleArticle: PropTypes.func,
        hideCategories: PropTypes.bool.isRequired,
        hideDescription: PropTypes.bool.isRequired,
        hideOwner: PropTypes.bool.isRequired,
        hideCreationDate: PropTypes.bool.isRequired,
        hideStatus: PropTypes.bool.isRequired,
        withArticleLink: PropTypes.bool.isRequired
    };

    static defaultProps = {
        isEditing: false,
        loading: false,
        selected: false,
        hideCategories: false,
        hideDescription: false,
        hideOwner: true,
        hideCreationDate: true,
        hideStatus: false,
        withArticleLink: false
    };

    handleSelectionToggled = (article, isChecked) => {
        if (typeof this.props.onToggleArticle === 'function') {
            this.props.onToggleArticle(article);
        }
    };

    renderEmptyList() {
        return (
            <Placeholder width={100} height={100} text={this.props.emptyText} loading={this.props.loading} loadingText="... Artikel werden geladen ..." isVertical={false} />
        )
    }

    renderArticleRowList() {
        const { isEditing, selected, hideCategories, hideDescription, hideOwner, hideCreationDate, hideStatus, withArticleLink } = this.props;
        let articleRows = this.props.articles.map(article => (
            <ArticleRow
                key={article._id}
                article={article}
                selected={selected}
                onSelectionToggled={this.handleSelectionToggled}
                hideCheckbox={!isEditing}
                hideCategories={hideCategories}
                hideDescription={hideDescription}
                hideOwner={hideOwner}
                hideCreationDate={hideCreationDate}
                hideStatus={hideStatus}
                withArticleLink={withArticleLink}/>
        ));

        return (
            <div className="article-row-list_container">
                {articleRows}
            </div>
        );
    }

    render() {
        return (this.props.articles.length > 0) ? this.renderArticleRowList() : this.renderEmptyList();
    }
}
