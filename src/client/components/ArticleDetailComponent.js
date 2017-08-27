import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';
//import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
//import FlatButton from 'material-ui/FlatButton';

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
                <Card.Content>
                    <Icon name='user'/>{this.props.owner.name}
                </Card.Content>
            </Card>
        );
        /*return (
            <Card>
                <CardHeader
                    title={this.props.title}
                    subtitle={this.props.id}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>{this.props.description}</CardText>
                <CardActions>
                    <FlatButton label="Action1" />
                    <FlatButton label="Action2" />
                </CardActions>

            </Card>
        );*/
    }
}

export default ArticleDetailComponent;

ArticleDetailComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    owner: PropTypes.object.isRequired
};
