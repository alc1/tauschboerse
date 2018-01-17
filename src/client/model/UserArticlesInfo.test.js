import UserArticlesInfo from './UserArticlesInfo';

const createFootball = () => {
    return {
        _id: '1',
        title: 'Fussball',
        description: 'Ein Ball zum Fussballspielen'
    };
};

const createTable = () => {
    return {
        _id: '2',
        title: 'Tisch',
        description: 'Ein exklusiver Designer-Tisch'
    };
};

const createUserArticlesFilter = () => {
    return {
        filterText: 'Test',
        filterStatus: 'FREE'
    };
};

describe('UserArticlesInfo', () => {

    describe('A UserArticlesInfo instance', () => {
        test(`can be cloned correctly`, () => {
            const initialUserArticlesInfo = new UserArticlesInfo();
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo)
            expect(newUserArticlesInfo).toEqual(initialUserArticlesInfo);
            expect(newUserArticlesInfo).not.toBe(initialUserArticlesInfo);
        });
        test(`with filter and articles can be cloned correctly`, () => {
            const articles = [ createFootball(), createTable() ];
            const filter = createUserArticlesFilter();
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles).setFilter(filter.filterText, filter.filterStatus);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo)
            expect(newUserArticlesInfo).toEqual(initialUserArticlesInfo);
            expect(newUserArticlesInfo).not.toBe(initialUserArticlesInfo);
        });
    });

    describe('isFilteredByStatus in an instance', () => {
        test('that is empty is false', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to undefined is false', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('');
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to null is false', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('', null);
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to FREE is true', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('', 'FREE');
            expect(userArticlesInfo.isFilteredByStatus).toBe(true);
        });
    });

    // dscribe('setArticles', () => {
    //     test('with undefined sets an empty array', () => {

    //     });
    //     test('with null seta an empty array', () => {
            
    //     });
    //     test('with an array of articles sets the articles correctly', () => {
            
    //     });
    //     test('with an array and a filter sets the articles correctly', () => {
            
    //     });
    //     test('with an array, a filter and a status filter sets the articles correctly', () => {
            
    //     });
    // });

    // dscribe('', () => {
    //     test('', () => {
            
    //     });
    // });

    // dscribe('', () => {
    //     test('', () => {
            
    //     });
    // });

    // dscribe('', () => {
    //     test('', () => {
            
    //     });
    // });

    // dscribe('', () => {
    //     test('', () => {
            
    //     });
    // });
});