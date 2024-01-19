const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Topic = require('../../models/Topic')
const auth = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')


// Access Protected admin only
// Post a new Topic x
router.post('/createTopic',[isAdmin,
    check('name','Name of Topic is reqiured').not().isEmpty()]
,async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }
    const {name} = req.body;
    const topicfound = await Topic.findOne({'name':name});
    if (topicfound) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Topic already exists' }] });
    }
    
    try{
        const newTopic = new Topic({
            'name' : name
        });
        const topic = await newTopic.save();
        res.json(topic);
        console.log("New Topic added:",topic);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


// Access Protedted Admin only
// Get all topics
router.get('/',[isAdmin],async(req,res)=>{
    try{
        const alltopics = await Topic.find();
        res.json(alltopics);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
    
})

// Access Protected Admin only
// Route to Rename Topic
router.put('/:id',[isAdmin,
    check('Newname','Name of the Topic is required')],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }
    try{
        const {Newname} = req.body;
        const {id} = req.params;

        const topicfound = await Topic.findOne({name:Newname});
        if (topicfound) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Topic already exists' }] });
        }

        const result = await Topic.findByIdAndUpdate(
            id,
            { name: Newname }
        );
        res.json({ success: true, message: 'Topic name updated successfully.' });
          

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

//Get a Topic by ID
//Protected route access Admin only
router.get('/:id',isAdmin,async(req,res)=>{
    try{
        const {id} = req.params;
        // console.log("id:",id);
        const topic = await Topic.findById(id);
        if(!topic){
            res.status(404).json({message:"topic not found"});
        }
        
        res.status(200).json(topic);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
    
})

//
//
//

module.exports = router;
