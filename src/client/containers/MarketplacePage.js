import { connect } from 'react-redux';

import muiThemeable from 'material-ui/styles/muiThemeable';

import MarketplacePage from '../components/MarketplacePage/MarketplacePage';

import { clearLastSearch, findArticles, openMarketplaceSection } from '../store/actions/marketplace';
import { getMarketplaceSectionIndex, getSearchInfo } from '../store/selectors/marketplace';
import { getUser } from '../store/selectors/user';
import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState),
        marketplaceSectionIndex: getMarketplaceSectionIndex(theState),
        searchInfo: getSearchInfo(theState),
        user: getUser(theState),
    };
}

export default connect(mapStateToProps, { clearLastSearch, findArticles, openMarketplaceSection })(muiThemeable()(MarketplacePage));
