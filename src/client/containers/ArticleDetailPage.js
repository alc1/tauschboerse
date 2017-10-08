import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArticleComponent from '../components/ArticleComponent';
import { loadArticle } from '../actions/article';
import { getArticle } from '../selectors/article';

class ArticleDetailPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        loadArticle: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { articleId } = this.props.match.params;
        this.props.loadArticle(articleId);
    }

    render() {
        const { article } = this.props;
        return (
            <div>
                {article && <ArticleComponent article={article}/>}
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        article: getArticle(theState)
    };
}

export default connect(mapStateToProps, { loadArticle })(ArticleDetailPage);
