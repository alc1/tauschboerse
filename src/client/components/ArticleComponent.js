import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';

class ArticleComponent extends React.Component {
    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{this.props.article.title}</Card.Header>
                    <Card.Meta>{this.props.article.id}</Card.Meta>
                    <Card.Description>{this.props.article.description}</Card.Description>
                </Card.Content>
                <Card.Content>
                    <Icon name='user'/>{this.props.article.user.name}
                </Card.Content>
                <Card.Content>
                    <Link to={`/article/${this.props.article._id}`}><Button>Detail</Button></Link>
                </Card.Content>
            </Card>
        );
    }
}

export default ArticleComponent;

ArticleComponent.propTypes = {
    article: PropTypes.object.isRequired
};
