'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUser);
router.get('/:userId/articles', articlesController.getArticlesByUser);

module.exports = router;
