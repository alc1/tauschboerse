import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArticleDetailComponent from '../components/ArticleDetailComponent';
import * as Actions from '../actions/actions';
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(theState) {
    return {
        article: getArticle(theState)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetailPage);
