import React from 'react';
import PropTypes from 'prop-types';

import Chip from 'material-ui/Chip';
import { black, cyan500, blue500, orange900, deepOrangeA700, white } from 'material-ui/styles/colors';

import ArticleStatus from '../../../shared/constants/ArticleStatus';

import './ArticleStatusTag.css';

export default class ArticleStatusComponent extends React.Component {

    static propTypes = {
        status: PropTypes.string.isRequired
    };

    getColor = (theStatus) => {
        switch (theStatus) {
            case ArticleStatus.STATUS_FREE:
                return cyan500;
            case ArticleStatus.STATUS_DEALING:
                return blue500;
            case ArticleStatus.STATUS_DEALED:
                return orange900;
            case ArticleStatus.STATUS_DELETED:
                return deepOrangeA700;
            default:
                return black;
        }
    };

    render() {
        const { status } = this.props;
        return (
            <div className="article-status-tag">
                <Chip backgroundColor={this.getColor(status)} labelColor={white}>{ArticleStatus.getDescription(status)}</Chip>
            </div>
        );
    }
}
