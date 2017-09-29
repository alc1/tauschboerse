import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArticleDetailComponent from '../components/ArticleDetailComponent';
import { loadArticle } from '../actions/actions';
import { getArticle } from '../store/article';

class ArticleDetailPage extends React.Component {

    componentDidMount() {
        const { articleId } = this.props.match.params;
        this.props.loadArticle(articleId);
    }

    render() {
        const { article } = this.props;
        return (
            <div>
                {article && <ArticleDetailComponent article={article}/>}
            </div>
        );
    }
}

ArticleDetailPage.propTypes = {
    article: PropTypes.object,
    loadArticle: PropTypes.func.isRequired
};

function mapStateToProps(theState) {
    return {
        article: getArticle(theState)
    };
}

export default connect(mapStateToProps, { loadArticle })(ArticleDetailPage);
