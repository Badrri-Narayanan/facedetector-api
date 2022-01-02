const redisClient = require('./signin').redisClient;

const requireAuth = async(req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        console.log("authoriztion unsuccessful")
        return res.status(401).json('Unauthorized');
    }
    let id = await redisClient.get(authorization);
    if(!id) {
        console.log("authoriztion unsuccessful")
        return res.status(401).json('Unauthorized');
    }
    console.log("authoriztion successful")
    return next();
}

module.exports = {
    requireAuth,
}