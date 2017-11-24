import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../components/ApplicationBar';
import ArticleGridList from '../components/ArticleGridList';

import { setLoading } from '../actions/application';
import { loadArticle } from '../actions/article';
import { getArticle } from '../selectors/article';

class ArticleDetailPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        loadArticle: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { articleId } = this.props.match.params;
        this.props.loadArticle(articleId)
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    render() {
        const { article } = this.props;
        return (
            <div>
                <ApplicationBar/>
                {article && <ArticleGridList articles={[article]}/>}
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        article: getArticle(theState)
    };
}

export default connect(mapStateToProps, { loadArticle, setLoading })(ArticleDetailPage);
