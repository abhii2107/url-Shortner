const User = require('../models/users')
const{v4:uuidv4} = require('uuid')
const{setUser} = require('../service.js/auth')
async function handleUserSignup(req,res){
    const {name,email,password } = req.body;
    await User.create({
        name,
        email,
        password
    })

    return res.render("/"); 
}
async function handleUserLogin(req,res){
    const {email,password } = req.body;
    
    const user = await User.findOne({
        
        email,
        password
    })
    console.log(user)
    if(!user){
        return res.render("login",{
            error: "Invalid username or Password"
        })
    }
    // we do not need the session id in the stateless
    // const sessionId = uuidv4();
    // now we need to store this session id with user object we will make a service
    // setUser(sessionId,user)// jsut need to pass the user in jwt and it will give me token
    const token = setUser(user);
    res.cookie('uid', token);
    // now i need to take the value of cookie in the middleware check for the user
    
    return res.redirect("/"); 
}

module.exports = {handleUserSignup, handleUserLogin};