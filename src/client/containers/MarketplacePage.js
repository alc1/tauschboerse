import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import MarketplacePage from '../components/MarketplacePage/MarketplacePage';

import { findArticles, clearLastSearch, createTrade, openSection } from '../store/actions/marketplace';
import { setLoading } from '../store/actions/application';
import { getLastSearch, getTrade, getSectionIndex } from '../store/selectors/marketplace';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        lastSearch: getLastSearch(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        trade: getTrade(theState),
        sectionIndex: getSectionIndex(theState)
    };
}

export default connect(mapStateToProps, { findArticles, clearLastSearch, createTrade, setLoading, openSection })(muiThemeable()(MarketplacePage));
