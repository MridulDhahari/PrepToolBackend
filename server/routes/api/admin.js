const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Admin = require('../../models/Admin.js')

// access Public
// Route to Create an user
router.post(
    '/',
    
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
  
      const { email, password } = req.body;
      console.log("email:",email);
      console.log("password:",password)
      try {
        let admin = await Admin.findOne({ 'email':email });
  
        if (admin) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Admin already exists' }] });
        }
  
        admin = new Admin({
          email,
          password,
          role:'admin'
        });
  
        const salt = await bcrypt.genSalt(10);
  
        admin.password = await bcrypt.hash(password, salt);
  
        await admin.save();
        
        const payload = {
            user:{
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: 'admin'
            }
        }
        console.log("new admin payload:",payload);
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
        // console.log("here")
        res.status(500).send('Server error');
      }
    }
  );
  
  module.exports = router;