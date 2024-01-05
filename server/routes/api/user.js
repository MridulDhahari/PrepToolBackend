const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User.js')

// access Public
// Route to Create a User
router.post(
    '/',
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password is required'
    ).isLength({ min: 6 }),
    //isExist
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, password } = req.body;
      console.log("name:",name);
      console.log("email:",email);
      console.log("password:",password)
      try {
        let user = await User.findOne({ 'email':email });
  
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }
  
        user = new User({
          name,
          email,
          password,
          role:'user'
        });
  
        const salt = await bcrypt.genSalt(10);
  
        user.password = await bcrypt.hash(password, salt);
  
        await user.save();
        
        const payload = {
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'user'
            }
        }
        console.log("new user payload:",payload);
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token)=>{
                if(err) throw err;
                console.log(token);
                return res.status(200).json({token});
            }
        );
        
      } catch (err) {
        console.error(err.message);
        console.log("here")
        res.status(500).send('Server error');
      }
    }
  );
  
  module.exports = router;