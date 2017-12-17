import { connect } from 'react-redux';

import HomePage from '../components/HomePage/HomePage';

import { getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default connect(mapStateToProps)(HomePage);
