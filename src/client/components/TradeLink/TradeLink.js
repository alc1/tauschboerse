import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import AvatarTag from '../AvatarTag/AvatarTag';
import TradeStateTag from '../TradeStateTag/TradeStateTag';

import './TradeLink.css';

export default class TradeLink extends React.Component {

    static propTypes = {
        trade: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    goToTrade = (theTradeId) => {
        this.props.history.push(`/trade/show/${theTradeId}`);
    };

    render() {
        const { trade, loading } = this.props;
        return (
            <Paper className="trade-link">
                <div className="trade-link__left-column">
                    <span>Tauschgeschäft mit</span>
                    <AvatarTag text={trade.tradePartner.name} icon={<AccountIcon/>}/>
                    <span>vom</span>
                    <AvatarTag text={moment(trade.trade.createDate).format('DD.MM.YYYY')} icon={<EditIcon/>}/>
                </div>
                <div className="trade-link__right-column">
                    <TradeStateTag status={trade.state}/>
                    <FlatButton label="Anzeigen" icon={<ShowIcon/>} disabled={loading} onClick={this.goToTrade.bind(this, trade._id)} primary/>
                </div>
            </Paper>
        );
    }
}
