import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import MarketplacePage from '../components/MarketplacePage/MarketplacePage';

import { findArticles, clearLastSearch, createTrade } from '../store/actions/marketplace';
import { setLoading } from '../store/actions/application';
import { getLastSearch, getTrade } from '../store/selectors/marketplace';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        lastSearch: getLastSearch(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        trade: getTrade(theState)
    };
}

export default connect(mapStateToProps, { findArticles, clearLastSearch, createTrade, setLoading })(muiThemeable()(MarketplacePage));
