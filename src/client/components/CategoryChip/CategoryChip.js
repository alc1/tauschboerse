import React from 'react';
import PropTypes from 'prop-types';

import Chip from 'material-ui/Chip';

import './CategoryChip.css';

const chipLabelStyle = { lineHeight: '24px', fontSize: 'small' };

export default class CategoryChip extends React.Component {

    static propTypes = {
        category: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    };

    render() {
        const { _id, name } = this.props.category;
        return (
            <div className="category-chip">
                <Chip labelStyle={chipLabelStyle} key={_id}>{name}</Chip>
            </div>
        );
    };
}
