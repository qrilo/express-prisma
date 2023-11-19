const express = require('express');
const AuthController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { loginValidation, registrationValidation, refreshValidation } = require('../validations/auth-validations');
const { validate } = require('../validations/validation');
const router = express.Router();


router.post('/login', loginValidation, validate, AuthController.login);
router.post('/register', registrationValidation, validate, AuthController.register);
router.post('/refresh', refreshValidation, validate, AuthController.refresh)

//router.get('/protected', authMiddleware, AuthController.protected);

module.exports = router;