import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArticleComponent from '../components/ArticleComponent';
import * as Actions from '../actions/actions';

class ArticleDetailPage extends React.Component {

    componentDidMount() {
        const { articleId } = this.props.match.params;
        this.props.loadArticle(articleId);
    }

    render() {
        const { article } = this.props;
        return (
            <div>
                {article && <ArticleComponent id={article._id} title={article.title} description={article.description}/>}
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
        article: theState.article
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetailPage);
