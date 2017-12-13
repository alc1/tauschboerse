import { withRouter } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';

import Intro from '../components/Intro';

export default withRouter(muiThemeable()(Intro));
