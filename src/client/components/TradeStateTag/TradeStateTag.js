import React from 'react';
import PropTypes from 'prop-types';

import { white } from 'material-ui/styles/colors';

import InitIcon from 'material-ui/svg-icons/editor/mode-edit';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import DealedIcon from 'material-ui/svg-icons/action/done-all';
import DeletedIcon from 'material-ui/svg-icons/navigation/cancel';

import AvatarTag from '../AvatarTag/AvatarTag';

import TradeState from '../../../shared/constants/TradeState';

export default class TradeStateTag extends React.Component {

    static propTypes = {
        status: PropTypes.string.isRequired
    };

    getIcon = (theStatus) => {
        switch (theStatus) {
            case TradeState.TRADE_STATE_INIT:
                return <InitIcon/>;
            case TradeState.TRADE_STATE_IN_NEGOTIATION:
                return <SwapIcon/>;
            case TradeState.TRADE_STATE_COMPLETED:
                return <DealedIcon/>;
            case TradeState.TRADE_STATE_CANCELED:
                return <DeletedIcon/>;
            default:
                return null;
        }
    };

    render() {
        const { status } = this.props;
        return (
            <AvatarTag backgroundColor={TradeState.getColor(status)} labelColor={white} text={TradeState.getShortDescription(status)} icon={this.getIcon(status)}/>
        );
    }
}
