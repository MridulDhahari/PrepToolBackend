const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    role:{
        type: String, enum: ['user', 'admin'], default: 'admin',
    }

});
module.exports = mongoose.model('admin', AdminSchema);