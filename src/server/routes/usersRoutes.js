'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');
const transactionsController = require('../controller/transactionsController');
const authenticationMiddleware = require('../middleware/authentication');
const userMiddleware = require('../middleware/user');

router.get('/', authenticationMiddleware, usersController.getAllUsers);
router.post('/', usersController.createUser);
router.get('/:userId', authenticationMiddleware, usersController.getUserById);
router.put('/:userId', [authenticationMiddleware, userMiddleware], usersController.updateUser);
router.get('/:userId/articles', authenticationMiddleware, articlesController.getArticlesByOwner);
router.put('/:userId/articles/:articleId', [authenticationMiddleware, userMiddleware], articlesController.updateArticle);
router.delete('/:userId/articles/:articleId', [authenticationMiddleware, userMiddleware], articlesController.deleteArticleById);
router.get('/:userId/transactions', authenticationMiddleware, transactionsController.getUserTransactions);
router.post('/auth', usersController.login);

module.exports = router;
