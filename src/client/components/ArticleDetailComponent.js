import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';

class ArticleDetailComponent extends React.Component {
    render() {
        return (
            // TODO: Currently this component shows the same as ArticleComponent, should be changed to an editor for the article
            <Card>
                <Card.Content>
                    <Card.Header>{this.props.title}</Card.Header>
                    <Card.Meta>{this.props.id}</Card.Meta>
                    <Card.Description>{this.props.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='user'/>{this.props.owner.name}
                </Card.Content>
            </Card>
        );
    }
}

export default ArticleDetailComponent;

ArticleDetailComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    owner: PropTypes.object.isRequired
};
