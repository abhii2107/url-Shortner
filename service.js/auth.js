// in stateless we do not need the state we will make the tokens 
// const sessionIdToUserMap = new Map(); // hashmap

const jwt = require("jsonwebtoken")

const secret = "Abhishek$123$@";
function setUser(user){
    
    return jwt.sign({
        id:user.id,
        email:user.email,
    },secret);
}

function getUser(token){
    if(!token) return null;
    return jwt.verify(token,secret);
}

module.exports = {
    setUser,
    getUser
}