import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import ArticleComponent from '../components/ArticleComponent';

import { loadArticle } from '../actions/article';
import { getArticle } from '../selectors/article';

class ArticleDetailPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        loadArticle: PropTypes.func.isRequired
    };

    state = {
        loading: false
    };

    componentDidMount() {
        this.setState({ loading: true });
        const { articleId } = this.props.match.params;
        this.props.loadArticle(articleId)
            .then((res) => this.setState({ loading: false }))
            .catch((err) => this.setState({ loading: false }));
    }

    render() {
        const { loading } = this.state;
        const { article } = this.props;
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <div className="articles-list">
                    {article && <ArticleComponent article={article}/>}
                </div>
                <GlobalMessageComponent/>
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
