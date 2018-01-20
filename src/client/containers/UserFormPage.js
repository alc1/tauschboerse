import { connect } from 'react-redux';

import UserFormPage from '../components/UserFormPage/UserFormPage';

import { setGlobalMessage } from '../store/actions/application';
import { updateUser } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';
import { getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { updateUser, setGlobalMessage })(UserFormPage);
