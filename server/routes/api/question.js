const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const config = require('config')
const Question = require('../../models/Question')
const auth = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')

router.post('/createQuestion',[auth,isAdmin,
    check('statement','statement is Required (Recommended Way Exam_Subject)!').not().isEmpty(),
    check('options', 'Name is required').not().isEmpty(),
    check('answer','answer is required').not().isEmpty(),
    check('explanation', 'explanation is required').not().isEmpty(),
    
    ],async(req,res)=>{
        console.log("here");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("trying to add ");
        const {statement,options,answer,explanation,exam_ids,topic_ids,subject_ids} = req.body;
        const newQuestion = new Subject({
            'statement' : statement,
            'options': options,
            'answer' : answer,
            'explanation' : explanation,
            'exam_ids' : exam_ids,
            'topic_ids' : topic_ids,
            'subject_ids' : subject_ids,
        });
        const question = await newQuestion.save();
        res.json(question);
        console.log("New Question added:",question);

    }
)

module.exports = router;