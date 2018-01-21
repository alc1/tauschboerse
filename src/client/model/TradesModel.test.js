import TradesModel from './TradesModel';

import TestTrade from '../testutils/TestTrade';
import TestUser from '../testutils/TestUser';

describe('TradesModel', () => {

    describe('highestVersionstamp', () => {
        test(`returns the highest versionstamp of the given trades`, () => {
            const user1 = new TestUser(1, 'stephen');
            const user2 = new TestUser(2, 'christian');
            const trades = [
                new TestTrade(user1, user2, 2),
                new TestTrade(user1, user2, 4),
                new TestTrade(user1, user2, 8),
                new TestTrade(user1, user2, 6)
            ];
            const tradesModel = new TradesModel(trades, user1);
            expect(tradesModel.highestVersionstamp).toEqual(8);
        });
    });
});