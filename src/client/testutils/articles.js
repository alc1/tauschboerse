import TestArticle from './TestArticle';

export const createArticle = (id, title, description) => {
    return new TestArticle(id, title, description);
}

export const createBasketball = () => {
    return createArticle(3, 'Basketball', 'Ein Ball zum Basketballspielen');
};

export const createFootball = () => {
    return createArticle(1, 'Fussball', 'Ein Ball zum Fussballspielen');
};

export const createTable = () => {
    return createArticle(2, 'Tisch', 'Ein exklusiver Designer-Tisch');
};

export const createUserArticlesFilter = () => {
    return {
        filterText: 'Test',
        filterStatus: 'FREE'
    };
};
