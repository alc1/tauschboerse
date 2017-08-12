import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArticleComponent from '../components/ArticleComponent';
import * as Actions from '../actions/actions';

class UserArticlesPage extends React.Component {

    componentDidMount() {
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId);
    }

    render() {
        const { userArticles } = this.props;
        const articleComponents = userArticles.map(article =>
            <div key={article._id}>
                <ArticleComponent id={article._id} title={article.title} description={article.description}/>
                <Link to={`/article/${article._id}`}>Detail</Link>
            </div>
        );
        return (
            <div>
                {articleComponents}
            </div>
        );
    }
}

UserArticlesPage.propTypes = {
    userArticles: PropTypes.array.isRequired,
    loadUserArticles: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(theState) {
    return {
        userArticles: theState.userArticles
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserArticlesPage);
