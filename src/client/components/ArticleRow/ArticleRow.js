import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Checkbox from 'material-ui/Checkbox';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import Photo from '../Photo/Photo';
import AvatarTag from '../AvatarTag/AvatarTag';
import ArticleStatusTag from '../ArticleStatusTag/ArticleStatusTag';
import PhotoPlaceholder from '../PhotoPlaceholder/PhotoPlaceholder';
import CategoryChip from '../CategoryChip/CategoryChip';

import './ArticleRow.css';

export default class ArticleRow extends React.Component {

    static propTypes = {
        article: PropTypes.object.isRequired,
        selectable: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
        onSelectionToggled: PropTypes.func.isRequired,
        hideCheckbox: PropTypes.bool.isRequired,
        hideCategories: PropTypes.bool.isRequired,
        hideDescription: PropTypes.bool.isRequired,
        hideOwner: PropTypes.bool.isRequired,
        hideCreationDate: PropTypes.bool.isRequired,
        hideStatus: PropTypes.bool.isRequired
    };
    
    static defaultProps = {
        selectable: false,
        selected: false,
        hideCheckbox: false,
        hideCategories: false,
        hideDescription: false,
        hideOwner: true,
        hideCreationDate: true,
        hideStatus: false
    };

    onSelectionToggled = (theEvent, isChecked) => {
        this.props.onSelectionToggled(this.props.article, isChecked);
    };

    render() {
        const { article, selected, selectable } = this.props;
        const { hideCheckbox, hideCategories, hideDescription, hideOwner, hideCreationDate, hideStatus } = this.props;
        const { title, description, status, created, owner, categories, photos } = article;
        const name = (owner) ? owner.name : '';
        const categoryChips = (categories) ? categories.map(category => <CategoryChip key={category._id} categoryName={category.name}/>) : [];
        const mainPhoto = (photos && photos.length > 0) ? photos.find(photo => photo.isMain) : null;
        const mainPhotoIndex = (photos && photos.length > 0) ? photos.reduce((mainPhotoIndex, photo, index) => photo.isMain ? index : mainPhotoIndex, 0) : 0;
        const photoSource = (mainPhoto) ? mainPhoto.url : photos && photos.length > 0 ? photos[0].url : null;
        return (
            <div className="article-row">
                <div className="article-row__checkbox-column">
                    {!hideCheckbox && <Checkbox checked={selected} disabled={!selectable} onCheck={this.onSelectionToggled}/>}
                </div>
                <div className="article-row__image-column">
                    {photoSource ? (
                        <Photo imageClassName="article-row__image article-row__image--clickable" photos={photos} mainPhotoIndex={mainPhotoIndex}/>
                    ) : (
                        <PhotoPlaceholder className="article-row__image" width={100} height={100}/>
                    )}
                </div>
                <div className="article-row__text-column">
                    <span className="article-row__title">{title}</span>
                    {!hideDescription && <span className="article-row__description">{description}</span>}
                    {!hideCategories && categoryChips.length > 0 &&
                        <div className="article-row__categories">
                            {categoryChips}
                        </div>
                    }
                </div>
                <div className="article-row__properties">
                    {!hideOwner && <AvatarTag text={name} icon={<AccountIcon/>}/>}
                    {!hideCreationDate && <AvatarTag text={`${moment(created).format('DD.MM.YYYY | HH:mm')}`} icon={<EditIcon/>}/>}
                    {!hideStatus && <ArticleStatusTag status={status}/>}
                </div>
            </div>
        );
    }
}
