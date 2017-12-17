import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import toJson from 'enzyme-to-json';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import ArticleCard from './ArticleCard';
import ArticleStatus from '../../../shared/constants/ArticleStatus';

const muiTheme = getMuiTheme();

Enzyme.configure({ adapter: new Adapter() });

const createArticle = () => {
    return {
        _id: '1',
        title: 'Fussballschuhe',
        description: 'Fussballschuhe, kaum gebraucht...',
        created: new Date('2017-12-16'),
        status: ArticleStatus.STATUS_FREE
    };
};

describe('ArticleCard', () => {
    test('Test that the ArticleCard renders correctly (snapshot).', () => {
        const article = createArticle();
        const tree = shallow(<ArticleCard article={article}/>, { context: { muiTheme } });
        expect(toJson(tree)).toMatchSnapshot();
    });
});
