import ArticlesDisplayInfo from './ArticlesDisplayInfo';
import { createArticle } from '../testutils/articles';

describe('ArticlesDisplayInfo', () => {

    describe('Cloning', () => {
        test('a fresh instance should return a copy of a freshly created instance', () => {
            const articlesDisplayInfo = new ArticlesDisplayInfo();
            const clonedArticlesDisplayInfo = new ArticlesDisplayInfo(articlesDisplayInfo);
            expect(clonedArticlesDisplayInfo).not.toBe(articlesDisplayInfo);
            expect(JSON.stringify(clonedArticlesDisplayInfo)).toEqual(JSON.stringify(articlesDisplayInfo));
        });
        test('a modified instance should return a copy of the instance', () => {
            let allArticles = [];
            for(let i = 0; i < 5; i++) {
                let article = createArticle(i+1, `Article ${i+1}`, `This is article ${i+1}`);
                allArticles.push(article);
            }
            const articles = allArticles.slice();
            const chosenArticles = [allArticles[0], allArticles[1], allArticles[2]];
            const articlesDisplayInfo = new ArticlesDisplayInfo().setArticles(articles).setChosenArticles(chosenArticles);
            const clonedArticlesDisplayInfo = new ArticlesDisplayInfo(articlesDisplayInfo);
            expect(clonedArticlesDisplayInfo).not.toBe(articlesDisplayInfo);
            expect(JSON.stringify(clonedArticlesDisplayInfo)).toEqual(JSON.stringify(articlesDisplayInfo));
        });
    });

});
