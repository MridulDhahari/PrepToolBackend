const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    statement:{
        type: String,
        required: true
    },
    options:{
        type: [String],
        required: true
    },
    answer:{
        type: String,
        required: true
    },
    explanation:{
        type: String,
        required:true
    },
    ecam_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exam',
    }],
    subject_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    }],
    topic_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic',
    }],

    
});
module.exports = mongoose.model('question', QuestionSchema);