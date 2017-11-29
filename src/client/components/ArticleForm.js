import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import ArticleStatusComponent from './ArticleStatusTag';
import InputComponent from './InputComponent';
import CategoryInputFieldContainer from '../containers/CategoryInputContainer';

import './ArticleForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleForm extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        status: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        owner: PropTypes.string,
        created: PropTypes.string,
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
        const { isDisplayMode, title, description, categories, status, owner, created, errors, loading, onChange, onAddCategory, onRemoveCategory } = this.props;
        return (
            <div className="article-form__container">
                <Paper className="article-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Artikeldetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="article-form__field-container">
                        <ArticleStatusComponent status={status}/>
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
                        <CategoryInputFieldContainer
                            isDisplayMode={isDisplayMode}
                            categories={categories}
                            errors={errors}
                            loading={loading}
                            onAddCategory={onAddCategory}
                            onRemoveCategory={onRemoveCategory}
                            allowNewValues={true}
                        />
                        {isDisplayMode && <InputComponent
                            isDisplayMode={isDisplayMode}
                            label="Besitzer"
                            value={owner}
                            field="owner"
                            disabled={loading}
                        />}
                        {isDisplayMode && <InputComponent
                            isDisplayMode={isDisplayMode}
                            label="Erstellt am"
                            value={created}
                            field="created"
                            disabled={loading}
                        />}
                    </div>
                </Paper>
            </div>
        );
    }
}
