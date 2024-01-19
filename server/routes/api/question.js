const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const config = require('config')
const Question = require('../../models/Question')
const auth = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')
const mongoose = require('mongoose');


router.post('/createQuestion',[auth,isAdmin,
    check('statement','statement is Required !').not().isEmpty(),
    check('options', 'options are required').not().isEmpty(),
    check('answer','answer is required').not().isEmpty(),
    check('difficulty','difficulty is required').not().isEmpty(),
    check('explanation', 'explanation is required').not().isEmpty(),
    
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {statement,options,answer,explanation,difficulty,exam_ids,topic_ids,subject_ids} = req.body;
        const newQuestion = new Question({
            'statement' : statement,
            'options': options,
            'answer' : answer,
            'explanation' : explanation,
            'difficulty' : difficulty,
            'exam_ids' : exam_ids,
            'topic_ids' : topic_ids,
            'subject_ids' : subject_ids,
        });
        const question = await newQuestion.save();
        res.json(question);
        console.log("New Question added:",question);

    }
)

router.put('/:id',[auth,isAdmin,
    check('statement','statement is Required !').not().isEmpty(),
    check('options', 'options are required').not().isEmpty(),
    check('answer','answer is required').not().isEmpty(),
    check('difficulty','difficulty is required').not().isEmpty(),
    check('explanation', 'explanation is required').not().isEmpty(),
    
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const {id} = req.params;
            const {statement,options,answer,explanation,difficulty,exam_ids,topic_ids,subject_ids} = req.body;
            const updatedQuestion = new Question({
                'statement' : statement,
                'options': options,
                'answer' : answer,
                'explanation' : explanation,
                'difficulty': difficulty,
                'exam_ids' : exam_ids,
                'topic_ids' : topic_ids,
                'subject_ids' : subject_ids,
            });
            const response = await Question.findByIdAndUpdate(
                id,
                {
                    'statement' : statement,
                    'options': options,
                    'answer' : answer,
                    'explanation' : explanation,
                    'difficulty': difficulty,
                    'exam_ids' : exam_ids,
                    'topic_ids' : topic_ids,
                    'subject_ids' : subject_ids
                }
            )
            if(response){
                // console.log("updated:",response);
                res.status(200).json({message:"Question updated successfully"});
            }
            else{
                res.status(400).json({message: "Upadte failed"});
            }
        }catch(err){
            res.status(500).send("Server Error");
        }
        
    }
)

//To get Question using id in params
//Route access to Both user and admin
//
router.get('/getById/:id',[auth],async(req,res)=>{
    try{
        // console.log("get by Id");
        const id = req.params.id;
        // console.log("id:",id);
        const question = await Question.findById(id);
        if(!question){
            res.status(404).json({message :"Question does not exist"});
        }
        res.status(200).json(question);

    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})



// Usage examples for the Get question using filters:

// To get all questions:                        /filter
// To get questions with a specific exam_id:    /filter?exam_id=your_exam_id
// To get questions with a specific difficulty: /filter?difficulty=your_difficulty
// To get questions with a specific topic_id:   /filter?topic_id=your_topic_id
// To get questions with a specific subject_id: /filter?subject_id=your_subject_id
// To combine multiple filters:                 /filter?exam_id=your_exam_id&topic_id=your_topic_id

//Access to both User and Admin
//Route : /filter?exam_id=your_exam_id&topic_id=your_topic_id&difficulty=your_difficulty
router.get('/filter',[auth],async(req,res)=>{
    try{
        console.log("here");
        const { exam_id, difficulty, topic_id, subject_id } = req.query;

        // Build the filter object based on the provided parameters
        const filters = {};

        if (exam_id) {
        filters.exam_ids = mongoose.Types.ObjectId.createFromHexString(exam_id);
        }

        if (difficulty) {
        filters.difficulty = difficulty;
        }

        if (topic_id) {
        filters.topic_ids = mongoose.Types.ObjectId.createFromHexString(topic_id);
        }

        if (subject_id) {
        filters.subject_ids = mongoose.Types.ObjectId.createFromHexString(subject_id);
        }

        // Query the database with the constructed filters
        const questions = await Question.find(filters);

        res.status(200).json(questions);

    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

//To delete the Question by Id
// Access only to admin
router.delete('/:id',[isAdmin],async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedItem = await Question.findByIdAndRemove(id);
        if (!deletedItem) {
        return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
        
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
})
module.exports = router;