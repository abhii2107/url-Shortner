const{getUser} =  require("../service.js/auth")


async function restrictToLoggedinUserOnly(req,res,next){
    const userUid = req.cookies?.uid;

    if(!userUid) return res.redirect("/login")
    const user = getUser(userUid);

    if(!user) return res.redirect("/login")

    req.user = user;
    next();
//    now we have to use cookie-parser in index.js
}

async function checkAuth(req,res,next){
    const userUid = req.cookies?.uid;
    // it is just checking not enforcing that you need to logged in
    
    const user = getUser(userUid);

    

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth
}