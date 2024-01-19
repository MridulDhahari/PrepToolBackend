const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next){
    
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg:'No Token, Authorization Denied'});
    }
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        console.log("decoded :",decoded);
        if(decoded.user.role!=='admin'){
            return res.status(401).json({msg:'User not authorised'});
        }
        console.log("User is the admin so allow");
        req.user = decoded.user;
        next();
    }catch(err){
        return res.status(401).json({msg: 'Token is not for valid for this user'});
    }
   
}