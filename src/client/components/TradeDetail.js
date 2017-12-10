import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './TradeDetail.css';

class TradeDetail extends React.Component {

    static propTypes = {
        trade: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
    };

    static defaultProps = {
        trade: null
    };

    // constructor(props) {
    //     super(props);
    // }

    render() {
        let title = this.props.trade ? <h1>Trade {this.props.trade._id}</h1> : <h1>Trade: unbekannt</h1>;

        return (
            <div>
                {title}
            </div>
        );
    }
}

export default TradeDetail;