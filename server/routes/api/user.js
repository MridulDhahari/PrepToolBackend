const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User.js')
const auth = require('../../middleware/auth')


// access Public
// Route to Create a User
router.post(
    '/',
    check('first_name', 'First name is required').notEmpty(),
    check('last_name', 'Last name is required').notEmpty(),
    check('username','username is required').notEmpty(),
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
  
      const { first_name,last_name,username,email, password } = req.body;
      console.log("firstname:",first_name);
      console.log("lastname:",last_name);
      console.log("username:",username);
      console.log("email:",email);
      console.log("password:",password)
      try {
        let emailFound = await User.findOne({ 'email':email });
  
        if (emailFound) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Email already exists' }] });
        }
        let usernameFound = await User.findOne({ 'username':username });
        console.log("username:",usernameFound);
        if(usernameFound){
          res.status(400).json({errors:[{msg: 'USername already exists'}] });
        }
  
        const user = new User({
          first_name,
          last_name,
          username,
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
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
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


//Protected User only
//Route '/enrollUser/:exam_id'
//Enroll user for an exam
router.put('/enrollUser/:exam_id',[auth],async(req,res)=>{
  try{
      
      const examId = req.params.exam_id;
      console.log("req.user:",req.user);
      const userId = req.user.id;
      const updatedUser = await User.findById(
        userId,
      );

      // Ensure exams_enrolled is initialized as an array
      if (!updatedUser.exams_enroled) {
        updatedUser.exams_enroled = [];
      }
      updatedUser.exams_enroled.push(examId);
      console.log(updatedUser.exams_enroled);
      await updatedUser.save();
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not updated' });
      }
      res.status(200).json('User updated succesfully');

  }catch(err){
      console.log(err.message);
      res.status(500).send('Server error');
  }
})


//Protected User only
//Route '/addQuestion/:question_id'
//Add a question to user list 
router.put('/addQuestion/:question_id',[auth],async(req,res)=>{
  try{
      
      const questionId = req.params.question_id;
      console.log("req.user:",req.user);
      const userId = req.user.id;
      const updatedUser = await User.findById(
        userId,
      );

      // Ensure exams_enrolled is initialized as an array
      if (!updatedUser.question_solved) {
        updatedUser.question_solved = [];
      }
      updatedUser.question_solved.push(questionId);
      console.log(updatedUser.question_solved);
      await updatedUser.save();
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not updated' });
      }
      res.status(200).json('User updated succesfully');

  }catch(err){
      console.log(err.message);
      res.status(500).send('Server error');
  }
})


// Get API for the current user
// Access only to the user
router.get('/me',[auth],async(req,res)=>{
  try{

    console.log(req.user);
    const id = req.user.id;
    const me = await User.findById(id);
    if(!me){
      res.status(404).json({message :'User not found'});
    }
    res.status(200).json(me);
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
})

  
  module.exports = router;