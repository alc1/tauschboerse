import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LinearProgress from 'material-ui/LinearProgress';

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
                {loading && <LinearProgress mode="indeterminate" color="#FF9800"/>}
                <div className="articles-list">
                    {article && <ArticleComponent article={article}/>}
                </div>
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
