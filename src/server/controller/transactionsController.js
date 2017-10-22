'use strict';

const transactionsStore = require('../services/transactionsStorage');
const offersStorage = require('../offersStorage');
const articlesStore = require('../services/articlesStorage');
const usersStore = require('../services/usersStorage');

async function getTransactions(req, res) {

}

async function getTransaction(req, res) {
    const { transactionId } = req.params;
    const transaction = await transactionsStore.getTransaction(transactionId);
    await fetchTransactionDetails(transaction);
    res.json({ transaction : transaction || null });
}

// async function getArticlesByUser(req, res) {
//     const { userId } = req.params;
//     const articles = await articlesStore.getArticlesByUser(userId);
//     for (let article of articles) {
//         await fetchArticleDetails(article);
//     }
//     res.json({ articles : articles || [] });
// }

// async function getArticle(req, res) {
//     const { articleId } = req.params;
//     const article = await articlesStore.getArticle(articleId);
//     await fetchArticleDetails(article);
//     res.json({ article : article || {} });
// }

async function fetchTransactionDetails(theTransaction) {
    theTransaction.user1 = await usersStore.getUser(theTransaction.user1Id);
    theTransaction.user2 = await usersStore.getUser(theTransaction.user2Id);
}

module.exports = {
    getTransactions,
    getTransaction
};
