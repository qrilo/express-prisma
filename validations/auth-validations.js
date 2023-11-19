const { body } = require('express-validator');

const registrationValidation = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8, max: 32 }).withMessage('The password must be at least 8 characters long and no longer than 32'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8, max: 32 }).withMessage('The password must be at least 8 characters long and no longer than 32'),
];

const refreshValidation = [
    body('token')
        .notEmpty()
        .withMessage('Token is empty')
]

module.exports = {
    registrationValidation,
    loginValidation,
    refreshValidation
};