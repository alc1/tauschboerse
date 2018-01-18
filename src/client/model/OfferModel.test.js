import OfferModel from './OfferModel';

import { createBasketball, createFootball, createTable, createUserArticlesFilter } from '../testutils/articles';
import TestOffer from '../testutils/TestOffer';
import TestUser from '../testutils/TestUser';

describe('ModelOffer', () => {

    describe('tradePartnerArticles', () => {
        test(`returns the articles not belonging to the given user`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1);
            const article2 = createTable().setOwner(user2);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.tradePartnerArticles).toEqual([article2]);
        });
    });

    describe('userArticles', () => {
        test(`returns the articles belonging to the given user`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1);
            const article2 = createTable().setOwner(user2);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.userArticles).toEqual([article1]);
        });
    });

    describe('isValid', () => {
        test(`returns false if any article has already been swapped`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1).setDealed();
            const article2 = createTable().setOwner(user2);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.isValid).toBe(false);
        });
        test(`returns false if any article has been deleted`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1);
            const article2 = createTable().setOwner(user2).setDeleted();
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.isValid).toBe(false);
        });
        test(`returns false if the user has offered no articles`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user2);
            const article2 = createTable().setOwner(user2);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.isValid).toBe(false);
        });
        test(`returns false if the user wants no articles`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1);
            const article2 = createTable().setOwner(user1);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.isValid).toBe(false);
        });
        test(`returns true if the user has specified articles wanted and offered and they are all available`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const article1 = createFootball().setOwner(user1);
            const article2 = createTable().setOwner(user2);
            const offer = new TestOffer(user1).setArticles([article1, article2]);
            const offerModel = new OfferModel(offer, user1);
            expect(offerModel.isValid).toBe(true);
        });
    });

});