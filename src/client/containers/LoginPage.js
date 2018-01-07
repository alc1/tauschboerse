import { connect } from 'react-redux';

import LoginPage from '../components/LoginPage/LoginPage';

import { login } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { login })(LoginPage);
