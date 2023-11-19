const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = function (error, request, response, next) {
    if (error instanceof ValidationError) {
        return response.status(error.statusCode).json(error.payload)
    }

    if (error instanceof NotFoundError) {
        return response.status(error.statusCode).json(error.payload)
    }

    if (error instanceof UnauthorizedError) {
        return response.status(error.statusCode).json(error.payload)
    }


    console.log(error);
    return response.status(500).json({ message: 'Internal error' })
};