import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from '../components/InputComponent';

export default class ArticleForm extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        const { title, description, categories, errors, loading, onChange, onSubmit } = this.props;
        const inputStyles = { width: '350px' };
        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };
        return (
            <form style={formStyles} onSubmit={onSubmit}>
                <InputComponent
                    style={inputStyles}
                    error={errors.title}
                    label="Titel"
                    onChange={onChange}
                    value={title}
                    field="title"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.description}
                    label="Beschreibung"
                    onChange={onChange}
                    value={description}
                    field="description"
                    multiLine={true}
                    disabled={loading}
                />
                <br/>
                {this.props.children}
            </form>
        );
    }
}
