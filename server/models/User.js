const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, enum: ['user', 'admin'], default: 'user',
    },
    mock_test_ids:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'mock_test',
        }
    ],
    question_solved:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question',
        }
    ],
    exams_enroled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'exam',
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('user', UserSchema);