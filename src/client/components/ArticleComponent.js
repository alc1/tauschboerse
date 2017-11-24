import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, CardHeader, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import NoPhotoComponent from './NoPhotoComponent';

import './ArticleComponent.css';

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
        const { title, description, owner, categories, photos, created } = article;
        const name = (owner) ? owner.name : '';
        const categoryNames = (categories) ? categories.map(category => category.name).join(', ') : '';
        const photoSource = (photos && photos.length > 0) ? photos[0].url : null;
        return (
            <div className="article-card">
                <Card>
                    <CardHeader title={`Von: ${name}`} subtitle={`Erstellt: ${moment(created).format('DD.MM.YYYY | HH:mm')}`} avatar={<Avatar>{name.substr(0, 1)}</Avatar>}/>
                    <div className="article-card__image-container">
                        {photoSource ? <img className="article-card__image" src={photoSource} alt={title}/> : <NoPhotoComponent/>}
                    </div>
                    <CardMedia overlay={<CardTitle title={title} subtitle={categoryNames} />}/>
                    <CardText className="article-card__text">{description}</CardText>
                    <CardActions>{actions}</CardActions>
                </Card>
            </div>
        );
    }
}

export default ArticleComponent;
