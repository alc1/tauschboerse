import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import AvatarTag from './AvatarTag';
import ArticleStatusComponent from './ArticleStatusTag';
import InputComponent from './InputComponent';
import CategoryInputField from '../containers/CategoryInputField';

import './ArticleForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleForm extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        article: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        errors: PropTypes.object,
        onChange: PropTypes.func,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    static defaultProps = {
        errors: {}
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { isDisplayMode, article, errors, loading, onChange, onAddCategory, onRemoveCategory } = this.props;
        let title = '', description = '', categories = [], status = null, owner = null, created = null;
        if (article) {
            title = article.title ? article.title : title;
            description = article.description ? article.description : description;
            categories = article.categories ? article.categories : categories;
            status = article.status ? article.status : status;
            owner = article.owner ? article.owner.name : owner;
            created = article.created ? moment(article.created).format('DD.MM.YYYY | HH:mm') : created;
        }
        return (
            <div className="article-form__container">
                <Paper className="article-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Artikeldetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="article-form__field-container">
                        {owner && <AvatarTag text={owner} icon={<AccountIcon/>}/>}
                        {created && <AvatarTag text={created} icon={<EditIcon/>}/>}
                        {status && <ArticleStatusComponent status={status}/>}
                        <InputComponent
                            isDisplayMode={isDisplayMode}
                            inputRef={inputElement => this.firstInputElement = inputElement}
                            error={errors.title}
                            label="Titel"
                            onChange={onChange}
                            value={title}
                            field="title"
                            disabled={loading}
                        />
                        <InputComponent
                            isDisplayMode={isDisplayMode}
                            error={errors.description}
                            label="Beschreibung"
                            onChange={onChange}
                            value={description}
                            field="description"
                            multiLine={true}
                            disabled={loading}
                        />
                        <CategoryInputField
                            isDisplayMode={isDisplayMode}
                            categories={categories}
                            errors={errors}
                            loading={loading}
                            onAddCategory={onAddCategory}
                            onRemoveCategory={onRemoveCategory}
                            allowNewValues={true}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}
