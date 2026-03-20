const { getUser } = require("../service.js/auth")

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token
    req.user = null;
    if (!tokenCookie) {
        return next();
    }
    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect("/login")

        if (!roles.includes(req.user.role)) res.end("unauthorized")

        next();
    }


}

module.exports = {
    checkForAuthentication,
    restrictTo
}