import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_CREATED,
    USER_UPDATED,
    USER_ARTICLES_FETCHED,
    USER_ARTICLES_FILTERED,
    userLoggedIn,
    userLoggedOut,
    userCreated,
    userUpdated,
    userArticlesFetched,
    userArticlesFiltered
} from '../actions/user';
import {
    ARTICLE_DELETED,
    articleDeleted
} from '../actions/article';
import userReducer, { initialState } from './user';
import UserArticlesInfo from '../../model/UserArticlesInfo';

const createDummyAction = () => {
    return {
        type: 'ANY_ACTION',
        payload: 'dummy payload'
    };
};
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
const createUser = () => {
    return {
        _id: '1',
        name: 'Max Mustermann',
        email: 'max@mustermann.com'
    };
};
const createUserArticlesFilter = () => {
    return {
        filterText: 'Test',
        filterStatus: 'FREE'
    };
};

describe('User Reducer', () => {

    describe(`Test action ${USER_LOGGED_IN}`, () => {
        test(`Putting logged in user to initial store. Expectation: New state should now contain the logged in user.`, () => {
            const user = createUser();
            const newState = userReducer(initialState, userLoggedIn(user));
            expect(newState).toEqual({ ...initialState, user: user });
        });
    });

    describe(`Test action ${USER_LOGGED_OUT}`, () => {
        test(`Removing user from store. Expectation: New state should now be like initial state.`, () => {
            const user = createUser();
            const userArticles = [ createFootball(), createTable() ];
            const newState = userReducer({ ...initialState, user: user, articles: userArticles }, userLoggedOut());
            expect(newState).toEqual(initialState);
        });
    });

    describe(`Test action ${USER_CREATED}`, () => {
        test(`Putting created user to initial store. Expectation: New state should now contain the created user.`, () => {
            const user = createUser();
            const newState = userReducer(initialState, userCreated(user));
            expect(newState).toEqual({ ...initialState, user: user });
        });
    });

    describe(`Test action ${USER_UPDATED}`, () => {
        test(`Putting updated user to store which already has a user. Expectation: New state should now contain the updated user.`, () => {
            const userArticles = [ createFootball(), createTable() ];
            const initialUser = createUser();
            let updatedUser = createUser();
            updatedUser.name = 'Max';
            updatedUser.email = 'm@muster.ch';
            const newState = userReducer({ ...initialState, user: initialUser, articles: userArticles }, userUpdated(updatedUser));
            expect(newState).toEqual({ ...initialState, user: updatedUser, articles: userArticles });
        });
    });

    describe(`Test action ${USER_ARTICLES_FETCHED}`, () => {
        test(`Putting fetched articles to store which has already a logged in user but no articles. Expectation: New state should now contain the fetched articles as well.`, () => {
            const user = createUser();
            const userArticles = [ createFootball(), createTable() ];
            const userArticlesInfo = new UserArticlesInfo().setArticles(userArticles);
            const newState = userReducer({ ...initialState, user: user }, userArticlesFetched(userArticles));
            expect(newState).toEqual({ ...initialState, user: user, userArticlesInfo: userArticlesInfo });
        });
        test(`Putting fetched articles to store which already has a logged in user with articles. Expectation: New state should now contain the newly fetched articles.`, () => {
            const user = createUser();
            const initialUserArticles = [ createFootball() ];
            const updatedUserArticles = [ createTable() ];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(initialUserArticles);
            const updatedUserArticlesInfo = new UserArticlesInfo().setArticles(updatedUserArticles);
            const newState = userReducer({ ...initialState, user: user, userArticlesInfo: initialUserArticlesInfo }, userArticlesFetched(updatedUserArticles));
            expect(newState).toEqual({ ...initialState, user: user, userArticlesInfo: updatedUserArticlesInfo });
        });
    });

    describe(`Test action ${ARTICLE_DELETED}`, () => {
        test(`Removing deleted article from store which is in initial state. Expectation: New state should still be in initial state.`, () => {
            const newState = userReducer(initialState, articleDeleted('1'));
            expect(newState).toEqual(initialState);
        });
        test(`Removing deleted article from store which does not contain the deleted article in user articles. Expectation: New state should still be the same.`, () => {
            const user = createUser();
            const userArticles = [ createFootball(), createTable() ];
            const userArticlesInfo = new UserArticlesInfo().setArticles(userArticles);
            const newState = userReducer({ ...initialState, user: user, userArticlesInfo: userArticlesInfo }, articleDeleted('3'));
            expect(newState).toEqual({ ...initialState, user: user, userArticlesInfo: userArticlesInfo });
        });
        test(`Removing deleted article from store which contains the deleted article in user articles. Expectation: New state should not contain the deleted article anymore.`, () => {
            const user = createUser();
            const initialUserArticles = [ createFootball(), createTable() ];
            const expectedUserArticles = [ createTable() ];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(initialUserArticles);
            const expectedUserArticlesInfo = new UserArticlesInfo().setArticles(expectedUserArticles);
            const newState = userReducer({ ...initialState, user: user, userArticlesInfo: initialUserArticlesInfo }, articleDeleted('1'));
            expect(newState).toEqual({ ...initialState, user: user, userArticlesInfo: expectedUserArticlesInfo });
        });
    });

    describe(`Test action ${USER_ARTICLES_FILTERED}`, () => {
        test(`Putting filter criteria to store which has already a logged in user. Expectation: New state should now contain the filter criteria as well.`, () => {
            const user = createUser();
            const userArticlesFilter = createUserArticlesFilter();
            const expectedUserArticlesInfo = new UserArticlesInfo().setFilter(userArticlesFilter.filterText, userArticlesFilter.filterStatus);
            const newState = userReducer({ ...initialState, user: user }, userArticlesFiltered(userArticlesFilter.filterText, userArticlesFilter.filterStatus));
            expect(newState).toEqual({ ...initialState, user: user, userArticlesInfo: expectedUserArticlesInfo });
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store in initial state.`, () => {
            const newState = userReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
        });
        test(`Expectation: Any other action should not affect store which is not in initial state.`, () => {
            const user = createUser();
            const userArticles = [ createFootball(), createTable() ];
            const newState = userReducer({ ...initialState, user: user, articles: userArticles }, createDummyAction());
            expect(newState).toEqual({ ...initialState, user: user, articles: userArticles });
        });
    });
});
