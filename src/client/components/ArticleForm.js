import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import InputComponent from '../components/InputComponent';
import CategoryInputFieldContainer from '../containers/CategoryInputContainer';

import './ArticleForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleForm extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onAddCategory: PropTypes.func.isRequired,
        onRemoveCategory: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { title, description, categories, errors, loading, onChange, onAddCategory, onRemoveCategory } = this.props;
        return (
            <div className="article-form__container">
                <Paper className="article-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Artikeldetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="article-form__field-container">
                        <InputComponent
                            inputRef={inputElement => this.firstInputElement = inputElement}
                            error={errors.title}
                            label="Titel"
                            onChange={onChange}
                            value={title}
                            field="title"
                            disabled={loading}
                        />
                        <InputComponent
                            error={errors.description}
                            label="Beschreibung"
                            onChange={onChange}
                            value={description}
                            field="description"
                            multiLine={true}
                            disabled={loading}
                        />
                        <CategoryInputFieldContainer
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
