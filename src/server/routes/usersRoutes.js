'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');
const authenticationMiddleware = require('../middleware/authentication');

router.get('/', authenticationMiddleware, usersController.getUsers);
router.post('/', usersController.createUser);
router.get('/:userId', authenticationMiddleware, usersController.getUser);
router.get('/:userId/articles', authenticationMiddleware, articlesController.getArticlesByUser);
router.post('/auth', usersController.login);

module.exports = router;
