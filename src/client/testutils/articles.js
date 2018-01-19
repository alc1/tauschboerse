import TestArticle from './TestArticle';
import { toBase26 } from './common';

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

export function generateArticleList(count) {
    let articles = [];
    for(let i = 0; i < count; i++) {
        let idx = toBase26(i);
        let article = createArticle(i+1, `Article ${idx}`, `This is article ${idx}`);
        articles.push(article);
    }
    return articles;
}
