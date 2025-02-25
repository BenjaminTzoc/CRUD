const express = require('express');
const validateSchema = require('../middlewares/validateSchema')
const { authMiddleware } = require('../middlewares/auth_middleware');
const { createProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/product_controller');

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/", getProducts);

module.exports = router;