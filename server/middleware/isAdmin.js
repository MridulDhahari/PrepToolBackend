const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next){
    
    // console.log('req.user :',tok);
    // next();
    try{
        const loggeduser = req.user;
        console.log("req.user:",loggeduser);
        if(loggeduser.role==='admin'){
            next();
        }
        else{
            res.status(401).json({msg: 'Token is not admin'});
        }
    }catch(err){
        res.status(401).json({msg: 'Server error'});
    }
   
}