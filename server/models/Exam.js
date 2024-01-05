const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    subject_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    }],
    test_ids:{
        type: [String],
    },
    about_exam:{
        type: [String],
        required: true
    }

});
module.exports = mongoose.model('exam', ExamSchema);