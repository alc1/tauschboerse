'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');
const tradesController = require('../controller/tradesController');
const authenticationMiddleware = require('../middleware/authentication');
const resourceUserValidatorMiddleware = require('../middleware/resourceUserValidator');

router.get('/', authenticationMiddleware, usersController.getAllUsers);
router.post('/', usersController.createUser);
router.get('/:userId', authenticationMiddleware, usersController.getUserById);
router.put('/:userId', [authenticationMiddleware, resourceUserValidatorMiddleware], usersController.updateUser);
router.get('/:userId/articles', authenticationMiddleware, articlesController.getArticlesByOwner);
router.put('/:userId/articles/:articleId', [authenticationMiddleware, resourceUserValidatorMiddleware], articlesController.updateArticle);
router.delete('/:userId/articles/:articleId', [authenticationMiddleware, resourceUserValidatorMiddleware], articlesController.deleteArticleById);
router.get('/:userId/trades', authenticationMiddleware, tradesController.getTradesByUser);
router.post('/auth', usersController.login);

module.exports = router;
