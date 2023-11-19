const AuthService = require('../services/auth-service');

class AuthController {
    async login(request, response, next) {
        const { email, password } = request.body;

        try {
            const result = await AuthService.login(email, password);

            return response.json(result);

        } catch (error) {
            next(error);
        }
    }

    async register(request, response, next) {
        const { email, password } = request.body;

        try {
            const result = await AuthService.register(email, password);

            return response.json(result);
        } catch (error) {
            next(error)
        }
    }

    async refresh(request, response, next) {
        const { token } = request.body;

        try {
            const result = await AuthService.refreshToken(token);

            return response.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();