import React from 'react';
import PropTypes from 'prop-types';

import { white } from 'material-ui/styles/colors';

import FreeIcon from 'material-ui/svg-icons/action/done';
import DealingIcon from 'material-ui/svg-icons/action/swap-horiz';
import DealedIcon from 'material-ui/svg-icons/action/done-all';
import DeletedIcon from 'material-ui/svg-icons/navigation/cancel';

import AvatarTag from '../AvatarTag/AvatarTag';

import ArticleStatus from '../../../shared/constants/ArticleStatus';

export default class ArticleStatusTag extends React.Component {

    static propTypes = {
        status: PropTypes.string.isRequired
    };

    getIcon = (theStatus) => {
        switch (theStatus) {
            case ArticleStatus.STATUS_FREE:
                return <FreeIcon/>;
            case ArticleStatus.STATUS_DEALING:
                return <DealingIcon/>;
            case ArticleStatus.STATUS_DEALED:
                return <DealedIcon/>;
            case ArticleStatus.STATUS_DELETED:
                return <DeletedIcon/>;
            default:
                return null;
        }
    };

    render() {
        const { status } = this.props;
        return (
            <AvatarTag backgroundColor={ArticleStatus.getColor(status)} labelColor={white} text={ArticleStatus.getDescription(status)} icon={this.getIcon(status)}/>
        );
    }
}
