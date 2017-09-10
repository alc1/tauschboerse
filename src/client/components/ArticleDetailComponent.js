import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class ArticleDetailComponent extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader
                    title={this.props.article.title}
                    subtitle={`Von ${this.props.article.user.name}`}/>
                <CardText>{this.props.article.description}</CardText>
            </Card>
        );
    }
}

export default ArticleDetailComponent;

ArticleDetailComponent.propTypes = {
    article: PropTypes.object.isRequired
};
