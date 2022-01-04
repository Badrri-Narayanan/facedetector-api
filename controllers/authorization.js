const jwt = require('jsonwebtoken');

const requireAuth = async(req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        console.log("authoriztion unsuccessful")
        return res.status(401).json('Unauthorized');
    }

    try {
        let decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        console.log("decoded id value = " + decoded.id);
    } catch(err) {
        console.error("authoriztion unsuccessful " + err)
        return res.status(401).json('Unauthorized');
    }
    console.log("authoriztion successful")
    return next();
}

module.exports = {
    requireAuth,
}