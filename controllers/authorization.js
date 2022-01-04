const jwt = require('jsonwebtoken');

const requireAuth = async(req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        console.log("authoriztion unsuccessful")
        return res.status(401).json('Unauthorized');
    }

    try {
        jwt.verify(authorization, process.env.JWT_SECRET);
    } catch(err) {
        console.error("authoriztion unsuccessful " + err)
        return res.status(401).json('Unauthorized');
    }
    return next();
}

module.exports = {
    requireAuth,
}