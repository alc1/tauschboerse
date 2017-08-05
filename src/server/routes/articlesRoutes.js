'use strict';

const router = require('express').Router();
const articles = require('../controller/articlesController');

router.get('/api/users/:userId/articles', articles.getUserArticles);
router.get('/api/articles/:articleId', articles.getArticle);

module.exports = router;
