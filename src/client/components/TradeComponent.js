import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

//import ArticleStatusComponent from './ArticleStatusTag';
import AvatarTag from './AvatarTag';

import './TradeComponent.css';

class TradeComponent extends React.Component {

    static propTypes = {
        trade: PropTypes.object.isRequired,
        actions: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: []
    };

    render() {
        const { trade, actions } = this.props;
        const { user1, user2, state, offers, createDate } = trade;

        return (
            <div className="trade-card">
                <Card>
                    <div className="trade-card__header">
                        Header
                    </div>
                    <CardText className="trade-card__text">Tauschgeschäft</CardText>
                    <CardActions>{actions}</CardActions>
                </Card>
            </div>
        );
    }
}

export default TradeComponent;