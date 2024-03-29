'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const authenticationMiddleware = require('../middleware/authentication');
const requestingUserProviderMiddleware = require('../middleware/requestingUserProvider');

router.get('/', requestingUserProviderMiddleware, articlesController.findArticles);
router.post('/', authenticationMiddleware, articlesController.createArticle);
router.get('/:articleId', requestingUserProviderMiddleware, articlesController.getArticleById);
router.put('/:articleId', authenticationMiddleware, articlesController.updateArticle);
router.delete('/:articleId', authenticationMiddleware, articlesController.deleteArticleById);
router.post('/:articleId/photos', authenticationMiddleware, articlesController.addPhoto);
router.delete('/:articleId/photos/:fileName', authenticationMiddleware, articlesController.deletePhoto);

module.exports = router;
