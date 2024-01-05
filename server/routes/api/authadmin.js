const express = require('express')
const router = express.Router();
const config = require('config')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/User.js')
const {check , validationResult} = require('express-validator')

// @ access public
// Route to Authenticate User
router.post(
    '/',
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a 6 or more characters').exists(),
    async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        } 
        const {email,password} = req.body;
        try{
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({errors: [{msg:'Invalid Credentials'}]});
            }
            const isMatch  = await brcypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({errors: [{msg:'Invalid Credentials'}]})
            }
            console.log("user id:",user.id);
            const payload = {
                user:{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
            console.log("admin log in payload:",payload);
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err,token)=>{
                    if(err) throw err;
                    // console.log('token ',token);
                    return res.status(200).json({token});
                }
            );
        }catch(err){
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
)
module.exports = router;