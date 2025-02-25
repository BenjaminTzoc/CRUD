const express = require('express');
const validateSchema = require('../middlewares/validateSchema')
const { userSchema, loginSchema } = require('../validators/user_validator');
const { register, login } = require('../controllers/user_controller');

const router = express.Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/", validateSchema(userSchema), register);

module.exports = router;