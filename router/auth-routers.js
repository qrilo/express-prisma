const express = require('express');
const AuthController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { loginValidation, registrationValidation, refreshValidation } = require('../validations/auth-validations');
const validationMiddleware = require('../middlewares/validation-middleware');
const router = express.Router();


router.post('/login', loginValidation, validationMiddleware, AuthController.login);
router.post('/register', registrationValidation, validationMiddleware, AuthController.register);
router.post('/refresh', refreshValidation, validationMiddleware, AuthController.refresh)

//router.get('/protected', authMiddleware, AuthController.protected);

module.exports = router;