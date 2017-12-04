import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import './TradesList.css';

export default class TradesList extends React.Component {

    static propTypes = {
        trades: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    };

    // static defaultProps = {
    // };

    render() {
        const { trades, loading } = this.props;
        const hasTrades = trades && trades.length > 0;
        const tradeRows = trades.map(trade => <tr key={trade._id}><td>{trade._id}</td></tr>);

        return (
            <div className="trades-list">
                <table>
                    <thead>
                        <tr>
                            <td>Id</td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        );
    }
}
