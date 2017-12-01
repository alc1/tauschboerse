import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './InputComponent';

export default class ArticleSearchComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    // static propTypes = {
    //     isDisplayMode: PropTypes.bool.isRequired,
    //     title: PropTypes.string.isRequired,
    //     description: PropTypes.string.isRequired,
    //     categories: PropTypes.array.isRequired,
    //     status: PropTypes.string.isRequired,
    //     loading: PropTypes.bool.isRequired,
    //     owner: PropTypes.string,
    //     created: PropTypes.string,
    //     errors: PropTypes.object,
    //     onChange: PropTypes.func,
    //     onAddCategory: PropTypes.func,
    //     onRemoveCategory: PropTypes.func
    // };

    // static defaultProps = {
    //     errors: {}
    // };

    render() {
        // return (
        //     <InputComponent
        //         isDisplayMode={isDisplayMode}
        //         inputRef={inputElement => this.firstInputElement = inputElement}
        //         error={errors.title}
        //         label="Suche"
        //         onChange={onChange}
        //         value=""
        //         field="suchtext"
        //     />
        // );
        return null;
    }
}