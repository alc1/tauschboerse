'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');
const transactionsController = require('../controller/transactionsController');
const authenticationMiddleware = require('../middleware/authentication');

router.get('/', authenticationMiddleware, usersController.getAllUsers);
router.post('/', usersController.createUser);
router.get('/:userId', authenticationMiddleware, usersController.getUser);
router.get('/:userId/articles', authenticationMiddleware, articlesController.getArticlesByUser);
router.get('/:userId/transactions', authenticationMiddleware, transactionsController.getUserTransactions);
router.post('/auth', usersController.login);

module.exports = router;
