const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    topic_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic',
    }],
    
});
module.exports = mongoose.model('subject', SubjectSchema);