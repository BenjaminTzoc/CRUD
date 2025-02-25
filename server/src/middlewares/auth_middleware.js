const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token)
        return res.status(200).json({ statusCode: 401, message: "Acceso denegado, token requerido" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`Token inválido: ${error}`);
        return res.status(200).json({ statusCode: 403, message: "Token inválido" });
    }
};

module.exports = { authMiddleware };