const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({msg: "No token provided"});

    try{
        req.user = jwt.verify(token, secret);
        next();
    }catch(error){
        res.status(401).json({msg: "Invalid token"});
    }
};