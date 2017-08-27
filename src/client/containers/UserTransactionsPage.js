import React from 'react';

class UserTransactionsPage extends React.Component {

    /*componentDidMount() {
        const { userId } = this.props.match.params;
        this.props.loadTransactions(userId);
    }*/

    render() {
        return (
            <div>
                {`Transactions for user ID: ${this.props.match.params.userId}`}
            </div>
        );
    }
}

export default UserTransactionsPage;
