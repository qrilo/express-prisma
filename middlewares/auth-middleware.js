const jwt = require('jsonwebtoken');

module.exports = function (request, response, next) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return response.status(401).json({ error: 'Invalid authorization format' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return response.status(403).json({ error: 'Invalid token' });
        }

        request.user = decoded;
        next();
    })
}