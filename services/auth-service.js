const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-error');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/not-found-error');
const crypto = require('crypto');
const UnauthorizedError = require('../errors/unauthorized-error');
const prisma = require('../prisma/prisma-client');

class AuthService {
    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new ValidationError({ message: 'Invalid credentials' });
        }

        const jwt = this.createJwt(user);
        const refresh = await this.createRefreshToken(user.id);

        return {
            jwt: jwt,
            refresh: refresh
        }
    }

    async register(email, password) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            throw new ValidationError({ message: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        return { id: newUser.id, email: newUser.email }
    }

    async refreshToken(token) {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: {
                token: token
            }
        })

        if (!refreshToken) {
            throw new NotFoundError({ message: 'Refresh token is not found' })
        }

        if (refreshToken.expiresAt < new Date()) {
            throw new UnauthorizedError({ message: 'Refresh token is expire' });
        }

        const user = await prisma.refreshToken.findUnique({
            where: {
                id: refreshToken.userId
            }
        });

        if (!user) {
            throw new NotFoundError({ message: 'User is not found' })
        }

        const jwt = this.createJwt(user);
        const refresh = await this.createRefreshToken(user.id);

        return {
            jwt: jwt,
            refresh: refresh
        }
    }

    createJwt(user) {
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        const date = new Date();
        const accessTokenExpire = date.setHours(date.getHours() + 1);

        return {
            token: accessToken,
            expiresAtUtc: new Date(accessTokenExpire)
        }
    }

    async createRefreshToken(userId) {
        const token = this.generateRefreshToken();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 6);

        const refreshToken = await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            }
        });

        return {
            token: refreshToken.token,
        }
    }

    generateRefreshToken() {
        return crypto.randomBytes(40).toString('hex');
    }
}

module.exports = new AuthService();