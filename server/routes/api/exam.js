const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const config = require('config')
const Exam = require('../../models/Exam')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const isAdmin = require('../../middleware/isAdmin')
const { findByIdAndDelete } = require('../../models/User')

//Protected Route Admin Only
// Route /createExam Method POST
// To create a New Exam
router.post('/createExam',[isAdmin,
    check('name','Name is Required (Recommended Way Exam_Subject)!').not().isEmpty(),
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {name,subject_ids,test_ids,about_exam } = req.body;
        // console.log("name:",name);
        // console.log("about exam:",about_exam);
        const ExamFound = await Exam.findOne({'name':name});
        if (ExamFound) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Exam Name already exists' }] });
        }
        try{
            const newExam = new Exam({
                'name' : name,
                'subject_ids': subject_ids,
                'test_ids' : test_ids,
                'about_exam' : about_exam
            });
            console.log("new exam:",newExam);
            const exam= await newExam.save();
            res.json(exam);
            console.log("New Exam added:",exam);
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }
)
//Public Route
//Route '/' method GET
//To get all the exams
router.get('/',async(req,res)=>{
    try{
        const allExams = await Exam.find({});
        return res.status(200).json(resp);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
})


//Protected Route
//Route '/:id' Method PUT
//Update the Exam
router.put('/:id',[isAdmin],async(req,res)=>{
    try{
        const {newName,newSubject_ids,newTest_ids,newAbout_exam} = req.body;

        const {id} = req.params;
        // console.log("id:",id);
        const getExam = await Exam.findById(id);
        if(!getExam){
            return res.status(404).json({message :"Could not find the exam"});
        }
        if(newName!==getExam.name){
            const sameName = await Exam.findOne({ name: newName });
            if(sameName){
                return res.status(400).json({message:'Exam name must be unique'});
            }
        }
        getExam.name= newName;
        getExam.subject_ids = newSubject_ids;
        getExam.test_ids = newTest_ids;
        getExam.about_exam = newAbout_exam;
        await getExam.save();
        return res.json({ message: 'Subject updated successfully'});

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
})


//Protected access Admin only
//Route :id Method delete
//Delete the exam 
router.delete('/:id',[isAdmin],async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedItem = await Exam.findByIdAndRemove(id);
        if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
        
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }

})

router.get('/:id',[auth],async(req,res)=>{
    try{
        const {id} = req.params;
        const sub = await Exam.findById(id);
        if(!sub){
            res.status(404).json({message:"Exam not found"});
        }
        res.status(200).json(sub);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;