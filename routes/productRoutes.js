const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

// use protected auth for all route
router.use(authController.protected);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.use(authController.restricTo('admin'));

router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;