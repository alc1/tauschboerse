import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

import ArticleComponent from '../components/ArticleComponent';
import { loadUserArticles } from '../actions/user';
import { getUserArticles } from '../selectors/user';

class UserArticlesPage extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        loading: false
    };

    componentDidMount() {
        this.setState({ loading: true });
        const { userId } = this.props.match.params;
        this.props.loadUserArticles(userId)
            .then((res) => this.setState({ loading: false }))
            .catch((err) => this.setState({ loading: false }));
    }

    showArticleDetails = (theArticleId) => {
        this.props.history.push(`/article/${theArticleId}`);
    };

    render() {
        const { loading } = this.state;
        const { articles } = this.props;
        const articleComponents = articles.map(article => {
            let actions = [];
            actions.push(<FlatButton key={actions.length} label="Detail" onClick={this.showArticleDetails.bind(this, article._id)} primary/>);
            return <ArticleComponent key={article._id} article={article} actions={actions}/>;
        });
        const ListWrapper = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
        
            @media (max-width: 750px) {
                flex-direction: column;
            }
        `;
        return (
            <div>
                {loading && <LinearProgress mode="indeterminate" color="#FF9800"/>}
                <ListWrapper>
                    {articleComponents}
                </ListWrapper>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles })(UserArticlesPage);
