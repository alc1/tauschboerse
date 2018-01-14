import React from 'react';
import PropTypes from 'prop-types';

import Chip from 'material-ui/Chip';

import './CategoryChip.css';

const chipLabelStyle = { lineHeight: '24px', fontSize: 'small' };

export default class CategoryChip extends React.Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired
    };

    render() {
        const { categoryName } = this.props;
        return (
            <div className="category-chip">
                <Chip labelStyle={chipLabelStyle}>{categoryName}</Chip>
            </div>
        );
    };
}
