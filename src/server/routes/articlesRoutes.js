'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');

router.get('/:articleId', articlesController.getArticle);

module.exports = router;
