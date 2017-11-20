import React from 'react';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';

class UserTransactionsPage extends React.Component {

    /*componentDidMount() {
        const { userId } = this.props.match.params;
        this.props.loadTransactions(userId);
    }*/

    render() {
        return (
            <div>
                <ApplicationBar/>
                {`Transactions for user ID: ${this.props.match.params.userId}`}
                <GlobalMessageComponent/>
            </div>
        );
    }
}

export default UserTransactionsPage;
