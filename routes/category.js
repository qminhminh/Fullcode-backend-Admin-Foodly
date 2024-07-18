const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getAllCategories);


module.exports = router;