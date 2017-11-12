import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, CardHeader, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import NoPicture from '../images/NoPicture.png';

class ArticleComponent extends React.Component {

    static propTypes = {
        article: PropTypes.object.isRequired,
        actions: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: []
    };

    render() {
        const { article, actions } = this.props;
        const { title, description, owner, categories, created } = article;
        const categoryNames = (categories) ? categories.map(category => category.name).join(', ') : '';
        return (
            <div className="article-card">
                <Card>
                    <CardHeader title={`Von: ${owner.name}`} subtitle={`Erstellt am: ${moment(created).format('DD.MM.YYYY HH:mm:ss')}`} avatar={<Avatar>{owner.name.substr(0, 1)}</Avatar>}/>
                    <CardMedia overlay={<CardTitle title={title} subtitle={categoryNames} />}>
                        <img src={NoPicture} alt=""/>
                    </CardMedia>
                    <CardText style={{whiteSpace: 'pre-wrap'}}>{description}</CardText>
                    <CardActions>{actions}</CardActions>
                </Card>
            </div>
        );
    }
}

export default ArticleComponent;
