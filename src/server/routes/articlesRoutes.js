'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const authenticationMiddleware = require('../middleware/authentication');
const requestingUserProviderMiddleware = require('../middleware/requestingUserProvider');

router.get('/', articlesController.findArticles);
router.post('/', authenticationMiddleware, articlesController.createArticle);
router.get('/:articleId', requestingUserProviderMiddleware, articlesController.getArticleById);

module.exports = router;
