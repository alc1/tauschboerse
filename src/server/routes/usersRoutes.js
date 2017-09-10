'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const usersController = require('../controller/usersController');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUser);
router.get('/:userId/articles', articlesController.getArticlesByUser);
router.post('/auth', (req, res) => {
    res.json({ user: { _id: 'ph63KF1MYC8IZxfl', name: 'Max Mustermann', email: 'max@mustermann.com', token: 'test' } });
});

module.exports = router;
