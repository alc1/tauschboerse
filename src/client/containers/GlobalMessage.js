import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';

import GlobalMessage from '../components/GlobalMessage/GlobalMessage';

import { removeGlobalMessage } from '../store/actions/application';
import { logout } from '../store/actions/user';
import { getGlobalMessage } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        globalMessage: getGlobalMessage(theState)
    };
}

export default withRouter(connect(mapStateToProps, { removeGlobalMessage, logout })(muiThemeable()(GlobalMessage)));
