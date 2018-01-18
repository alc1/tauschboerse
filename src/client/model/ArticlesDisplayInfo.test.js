import ArticlesDisplayInfo from './ArticlesDisplayInfo';
import { ARTICLES_FOUND } from '../store/actions/marketplace';

describe('ArticlesDisplayInfo', () => {

    describe('Cloning', () => {
        test('a fresh instance should return a copy of a freshly created instance', () => {
            const articlesDisplayInfo = new ArticlesDisplayInfo();
            const clonedArticlesDisplayInfo = new ArticlesDisplayInfo(articlesDisplayInfo);
            expect(clonedArticlesDisplayInfo).not.toBe(articlesDisplayInfo);
            expect(JSON.stringify(clonedArticlesDisplayInfo)).toEqual(JSON.stringify(articlesDisplayInfo));
        });
        test('a modified instance should return a copy of the instance', () => {

        });
    });

});