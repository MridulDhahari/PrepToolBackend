const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Subject = require('../../models/Subject')
const auth = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')

// Access Protected and Admin only
// route to Add Subject
router.post('/createSubject',[auth,isAdmin,
    check('name','Name is Required (Recommended Way Exam_Subject)!').not().isEmpty(),
    check('topic_ids','The Sub-topic Field is Required !').not().isEmpty()
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {name,topic_ids} = req.body;
        console.log("name:",name);
        console.log("topic_ids:",topic_ids);
        const subjectfound = await Subject.findOne({'name':name});
        if (subjectfound) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Subject Name already exists' }] });
        }
        try{
            const newSubject = new Subject({
                'name' : name,
                'topic_ids': topic_ids
            });
            const subject = await newSubject.save();
            res.json(subject);
            console.log("New Subject added:",subject);
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error');
        }
})

// Access Protected And Admin Only
// route to GET all Subjects
router.get('/',[auth,isAdmin],async(req,res)=>{
    
    try{
        const allsubjects = await Subject.find({});
        res.json(allsubjects);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

//Access Protected And Admin only
// Route to Update Subject information
// Add a new Topic to Topic_name
router.put('/:id',[auth,isAdmin],async(req,res)=>{
    const {newName,newTopic_ids} = req.body;
    const {id} = req.params;
    try{
        const getSubject = await Subject.findById(id);
        if(!getSubject){
            return res.status(404).json({ message: 'Subject not found' });
        }
        console.log("getsubject: ",getSubject);
        console.log("subject was found");
        if(newName!==getSubject.name){
            const sameName = await Subject.findOne({ name: newName });
            if(sameName){
                return res.status(400).json({message:'Subject name must be unique'});
            }
        }
        getSubject.name= newName;
        getSubject.topic_ids = newTopic_ids;
        await getSubject.save();
        return res.json({ message: 'Subject updated successfully' });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;