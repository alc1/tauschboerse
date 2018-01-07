import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import MarketplacePage from '../components/MarketplacePage/MarketplacePage';

import { findArticles, clearLastSearch, createTrade, openMarketplaceSection } from '../store/actions/marketplace';
import { getLastSearch, getTrade, getMarketplaceSectionIndex } from '../store/selectors/marketplace';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        lastSearch: getLastSearch(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        trade: getTrade(theState),
        marketplaceSectionIndex: getMarketplaceSectionIndex(theState)
    };
}

export default connect(mapStateToProps, { findArticles, clearLastSearch, createTrade, openMarketplaceSection })(muiThemeable()(MarketplacePage));
