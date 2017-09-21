'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const authenticationMiddleware = require('../middleware/authentication');

router.get('/:articleId', authenticationMiddleware, articlesController.getArticle);

module.exports = router;
