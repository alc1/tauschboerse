'use strict';

const router = require('express').Router();
const categoriesController = require('../controller/categoriesController');

router.get('/', categoriesController.getAllCategories);
router.get('/:categoryId', categoriesController.getCategory);

module.exports = router;
