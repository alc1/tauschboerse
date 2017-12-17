import { connect } from 'react-redux';

import RegistrationPage from '../components/RegistrationPage/RegistrationPage';

import { setLoading, setGlobalMessage } from '../store/actions/application';
import { createUser } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { createUser, setLoading, setGlobalMessage })(RegistrationPage);
