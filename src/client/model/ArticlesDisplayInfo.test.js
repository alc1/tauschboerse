import ArticlesDisplayInfo from './ArticlesDisplayInfo';
import { createArticle, generateArticleList, createFootball, createBasketball, createTable } from '../testutils/articles';

describe('ArticlesDisplayInfo', () => {

    describe('Cloning', () => {
        test('a fresh instance should return a copy of a freshly created instance', () => {
            const articlesDisplayInfo = new ArticlesDisplayInfo();
            const clonedArticlesDisplayInfo = new ArticlesDisplayInfo(articlesDisplayInfo);
            expect(clonedArticlesDisplayInfo).not.toBe(articlesDisplayInfo);
            expect(JSON.stringify(clonedArticlesDisplayInfo)).toEqual(JSON.stringify(articlesDisplayInfo));
        });
        test('a modified instance should return a copy of the instance', () => {
            let allArticles = generateArticleList(5);
            const articles = allArticles.slice();
            const chosenArticles = [allArticles[0], allArticles[1], allArticles[2]];
            const articlesDisplayInfo = new ArticlesDisplayInfo().setArticles(articles).setChosenArticles(chosenArticles);
            const clonedArticlesDisplayInfo = new ArticlesDisplayInfo(articlesDisplayInfo);
            expect(clonedArticlesDisplayInfo).not.toBe(articlesDisplayInfo);
            expect(JSON.stringify(clonedArticlesDisplayInfo)).toEqual(JSON.stringify(articlesDisplayInfo));
        });
    });

    describe('setPageSize', () => {
        test('changes the page size', () => {
            const info = new ArticlesDisplayInfo();
            const defaultPageSize = info.pageSize;
            const newPageSize = defaultPageSize * 2;
            info.setPageSize(newPageSize);
            expect(info.pageSize).toBe(newPageSize);
        });
        test('changes the page count accordingly', () => {
            const articleCount = 50;
            let articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setArticles(articles);
            const newPageSize = info.pageSize === 5 ? 10 : 5;
            expect(info.pageCount).toBe(Math.floor(articleCount / info.pageSize) + ((articleCount % info.pageSize > 0) ? 1 : 0));
            info.setPageSize(newPageSize)
            expect(info.pageCount).toBe(Math.floor(articleCount / newPageSize) + ((articleCount % info.pageSize > 0) ? 1 : 0));
        });
        test('adjusts pageNum if it becomes out-of-bounds', () => {
            const articleCount = 50;
            let articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setPageSize(5).setArticles(articles).setPageNum(9);
            expect(info.pageNum).toBe(9);
            info.setPageSize(10);
            expect(info.pageNum).toBe(5);
        });
    });

    describe('setPageNum', () => {
        test('changes the current pageNum', () => {
            const articleCount = 50;
            let articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setPageSize(5).setArticles(articles);
            expect(info.pageNum).toBe(1);
            const newPageNum = 6;
            info.setPageNum(newPageNum);
            expect(info.pageNum).toBe(newPageNum);
        });
        test('sets the pageNum to 1 if a number less than 1 is specified', () => {
            const articleCount = 50;
            let articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setPageSize(5).setArticles(articles);
            expect(info.pageNum).toBe(1);
            const newPageNum = 6;
            info.setPageNum(newPageNum);
            expect(info.pageNum).toBe(newPageNum);
            info.setPageNum(-6);
            expect(info.pageNum).toBe(1);
        });
        test('sets the pageNum to pageCount if a number higher than the pageCount is specified', () => {
            const articleCount = 50;
            let articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setPageSize(5).setArticles(articles);
            expect(info.pageNum).toBe(1);
            const newPageNum = 6;
            info.setPageNum(newPageNum);
            expect(info.pageNum).toBe(newPageNum);
            info.setPageNum(info.pageCount + 7);
            expect(info.pageNum).toBe(info.pageCount);
        });
        test('sets the list of visible articles correctly', () => {
            const pageSize = 5;
            const pageCount = 6;
            const articleCount = pageSize * pageCount;
            const articles = generateArticleList(articleCount);
            const info = new ArticlesDisplayInfo().setPageSize(pageSize).setArticles(articles);
            expect(info.visibleArticles).toEqual(articles.slice(0, pageSize));
            const newPageNum = 3;
            info.setPageNum(newPageNum);
            const startIdx = (newPageNum - 1) * pageSize;
            const endIdx = startIdx + pageSize;
            expect(info.visibleArticles).toEqual(articles.slice(startIdx, endIdx));
        });
    });

    describe('setArticles', () => {
        test('sets the list of articles generating lists of available-, filtered- and visible articles', () => {
            const info = new ArticlesDisplayInfo();
            const articles = generateArticleList(info.pageSize);
            info.setArticles(articles);
            expect(info.articles).toEqual(articles);
            expect(info.availableArticles).toEqual(articles);
            expect(info.filteredArticles).toEqual(articles);
            expect(info.visibleArticles).toEqual(articles);
        });
        test('sets the list of available articles if chosen articles has already been set', () => {
            const info = new ArticlesDisplayInfo();
            const articles = generateArticleList(info.pageSize);
            const chosenArticles = [articles[0], articles[1], articles[2]];
            const availableArticles = articles.slice(3);
            info.setArticles(articles);
            expect(info.availableArticles).toEqual(articles);
            info.setChosenArticles(chosenArticles);
            expect(info.availableArticles).toEqual(availableArticles);
        });
        test('sets the list of filtered articles, correctly filtered if a filter has been defined', () => {
            const articles = [createFootball(), createBasketball(), createTable()];
            const info = new ArticlesDisplayInfo().setFiltertext('ball');
            expect(info.filteredArticles).toEqual([]);
            info.setArticles(articles);
            expect(info.filteredArticles).toEqual([articles[0], articles[1]]);
        });
    });

    describe('setChosenArticles', () => {
        test('sets the list of chosen articles', () => {
            const articles = [createFootball(), createBasketball(), createTable()];
            const info = new ArticlesDisplayInfo();
            expect(info.chosenArticles).toEqual([]);
            info.setChosenArticles(articles);
            expect(info.chosenArticles).toEqual(articles);
            expect(info.articles).toEqual([]);
            expect(info.availableArticles).toEqual([]);
            expect(info.filteredArticles).toEqual([]);
            expect(info.visibleArticles).toEqual([]);
        });
        test('sets the list of availble articles if articles has already been set', () => {
            const info = new ArticlesDisplayInfo();
            const articles = generateArticleList(info.pageSize);
            const chosenArticles = [articles[0], articles[1], articles[2]];
            const availableArticles = articles.slice(3);
            info.setChosenArticles(chosenArticles);
            expect(info.availableArticles).toEqual([]);
            info.setArticles(articles)
            expect(info.availableArticles).toEqual(availableArticles);
        });
        test('sets the list of filtered articles, correctly filtered if a filter and articles have been defined', () => {
            const articles = [createFootball(), createBasketball(), createTable()];
            const info = new ArticlesDisplayInfo().setFiltertext('ball').setArticles(articles);
            const initialFilteredArticles = [articles[0], articles[1]];
            expect(info.filteredArticles).toEqual(initialFilteredArticles);
            info.setChosenArticles([articles[0]]);
            expect(info.filteredArticles).toEqual([articles[1]]);
        });
        test('sets the pageCount and pageNum correctly if a list of articles has already been defined', () => {
            const pageSize = 5;
            const pageCount = 6;
            const articlesCount = pageSize * pageCount;
            const articles = generateArticleList(articlesCount);
            const info = new ArticlesDisplayInfo().setPageSize(pageSize).setArticles(articles).setPageNum(pageCount);
            expect(info.pageCount).toBe(pageCount);
            const chosenArticles = articles.slice(0, 17);
            info.setChosenArticles(chosenArticles);
            expect(info.pageCount).toEqual(3);
            expect(info.pageNum).toEqual(3);
        });
    });

});
